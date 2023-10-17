import typer

from manager.commands import fund9Manager
from manager.commands import manager

app = typer.Typer()

app.add_typer(
    fund9Manager.app,
    name="fund9-manager",
    help="Manage Fund 9 data to supabase."
)

app.add_typer(
    manager.app,
    name="manager",
    help="Manage data to supabase."
)

if __name__ == "__main__":
    app()
