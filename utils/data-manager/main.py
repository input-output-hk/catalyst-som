import typer

from manager.commands import manager

app = typer.Typer()

app.add_typer(
    manager.app,
    name="manager",
    help="Manage data to supabase."
)

if __name__ == "__main__":
    app()
