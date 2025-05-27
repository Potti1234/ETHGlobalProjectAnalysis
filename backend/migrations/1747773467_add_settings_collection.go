package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection("settings")

		collection.ListRule = types.Pointer("user.id = @request.auth.id")
		collection.CreateRule = types.Pointer("user.id = @request.auth.id")
		collection.ViewRule = types.Pointer("user.id = @request.auth.id")
		collection.UpdateRule = types.Pointer("user.id = @request.auth.id")
		collection.DeleteRule = types.Pointer("user.id = @request.auth.id")

		collection.Fields.Add(
			&core.RelationField{
				Name:         "user",
				CollectionId: "users",
			},
		)

		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("settings")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
