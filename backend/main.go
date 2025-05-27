// main.go
package main

import (
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "pocketbasego/migrations"
)

type application struct {
	pb *pocketbase.PocketBase
}

func newApplication() *application {
	return &application{
		pb: pocketbase.New(),
	}
}

func main() {
	app := newApplication()

	// loosely check if it was executed using "go run"
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app.pb, app.pb.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Dashboard
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	app.mountFs()
	app.setupAuthHooks()
	app.disableHealthRouteLogging()

	if err := app.pb.Start(); err != nil {
		log.Fatal(err)
	}
}
