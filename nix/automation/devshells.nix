{
  inputs,
  cell,
}: let
  inherit (inputs) nixpkgs std;
  inherit (inputs.catalyst-core.packages) jcli;
  l = nixpkgs.lib // builtins;
in
  l.mapAttrs (_: std.lib.dev.mkShell) rec {
    default = {...}: {
      name = nixpkgs.lib.mkForce "Catalyst SOM";
      imports = [
        std.std.devshellProfiles.default
      ];
      nixago = [
        cell.configs.conform
        cell.configs.lefthook
        cell.configs.prettier
        cell.configs.treefmt
      ];
      packages = with nixpkgs; [];
    };
  }
