package migrations

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		superusers, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return err
		}

		// load .env file
		err = godotenv.Load(".env")

		if err != nil {
			log.Println("Error loading .env file")
		}

		record := core.NewRecord(superusers)

		record.Set("email", os.Getenv("POCKETBASE_ADMIN_EMAIL"))
		record.Set("password", os.Getenv("POCKETBASE_ADMIN_PASSWORD"))

		return app.Save(record)
	}, func(app core.App) error { // optional revert operation
		record, _ := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, os.Getenv("POCKETBASE_ADMIN_EMAIL"))
		if record == nil {
			return nil // probably already deleted
		}

		return app.Delete(record)
	})
}
