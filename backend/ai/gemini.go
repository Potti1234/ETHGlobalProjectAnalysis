package main

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"

	"github.com/pocketbase/pocketbase"
)

// GenericGeminiRequest defines the structure for a generic Gemini API request.
type GenericGeminiRequest struct {
	Prompt string `json:"prompt"`
}

// GenericGeminiResponse defines the structure for a generic Gemini API response.
type GenericGeminiResponse struct {
	ResponseText string `json:"responseText"`
}

// GenerateGenericContent calls the Gemini model with a given prompt and returns the text response.
// This method is intended for general purpose Gemini calls
func GenerateGenericContent(pb *pocketbase.PocketBase, prompt string) (string, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return "", errors.New("GEMINI_API_KEY environment variable is not set")
	}

	// Initialize Gemini client
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		pb.Logger().Error("Failed to initialize AI client", "error", err)
		return "", fmt.Errorf("failed to initialize AI client: %w", err)
	}
	defer client.Close()

	modelName := os.Getenv("GEMINI_MODEL")
	if modelName == "" {
		pb.Logger().Error("GEMINI_MODEL environment variable is not set")
		return "", errors.New("GEMINI_MODEL environment variable is not set")
	}
	model := client.GenerativeModel(modelName)

	// Generate response
	resp, err := model.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		pb.Logger().Error("Failed to generate content from AI", "error", err)
		return "", fmt.Errorf("failed to generate content: %w", err)
	}

	// Extract the text content from the response
	var responseText string
	if len(resp.Candidates) > 0 && resp.Candidates[0].Content != nil && len(resp.Candidates[0].Content.Parts) > 0 {
		if textPart, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
			responseText = string(textPart)
		} else {
			return "", errors.New("unexpected response format from AI: content part is not text")
		}
	} else {
		// Check for safety blocks or other reasons for empty candidates.
		if resp.PromptFeedback != nil && resp.PromptFeedback.BlockReason != genai.BlockReasonUnspecified {
			pb.Logger().Warn("Content generation blocked by AI", "reason", resp.PromptFeedback.BlockReason)
			return "", fmt.Errorf("content generation blocked by AI, reason: %s", resp.PromptFeedback.BlockReason)
		}
		for _, cand := range resp.Candidates {
			if cand.FinishReason != genai.FinishReasonStop && cand.FinishReason != genai.FinishReasonUnspecified {
				pb.Logger().Warn("Candidate generation finished with non-stop reason", "reason", cand.FinishReason)
				return "", fmt.Errorf("candidate generation finished unexpectedly, reason: %s", cand.FinishReason)

			}
		}
		return "", errors.New("empty or invalid response structure from AI")
	}

	return responseText, nil
}
