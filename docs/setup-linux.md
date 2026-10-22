# Setup: Linux (UxPlay / AirPlay mirroring)

Feasibility proof for Milestone 1. No application code; UxPlay stays an external dependency.

## Prerequisites

- Omarchy/Arch-based system, Wayland (Hyprland) session.
- UxPlay 1.73.7: `sudo pacman -S uxplay avahi`
- Avahi (mDNS) and a firewall (UFW on this machine).
- iPhone and PC on the same local subnet.

Verify: `uxplay --version`, `avahi-daemon --version`.

## Detect the firewall tool

Do not assume. Check:

```sh
systemctl is-active ufw firewalld nftables 2>&1
```

This machine uses **UFW** (active). If your tool differs, adapt the rules below.

## Firewall (UFW) — never disable it

Open only UxPlay's legacy ports, restricted to the local subnet.

Detect your subnet (example uses a placeholder):

```sh
ip -4 addr show <iface>   # e.g. wlo1; read the inet line
```

Back up first (for rollback):

```sh
sudo cp -a /etc/ufw /tmp/ufw-backup-etc
sudo ufw status numbered > /tmp/ufw-status-before.txt
```

Remove the old broad rules (IPv4 + IPv6) and add subnet-restricted ones:

```sh
sudo ufw delete allow 5000,5001,7000,7001,7100/tcp
sudo ufw delete allow 5353,6000,6001,7011/udp
sudo ufw allow from <LAN_SUBNET> to any port 7000,7001,7100 proto tcp comment 'UxPlay AirPlay legacy TCP (local subnet only)'
sudo ufw allow from <LAN_SUBNET> to any port 6000,6001,7011 proto udp comment 'UxPlay AirPlay legacy UDP (local subnet only)'
sudo ufw allow from <LAN_SUBNET> to any port 5353 proto udp comment 'mDNS/Avahi (local subnet only)'
```

Rollback: restore `/tmp/ufw-backup-etc` to `/etc/ufw` and `sudo ufw reload`, or delete the three new rules by number from `sudo ufw status numbered`.

Notes:

- Ports come from UxPlay's `-p` (legacy) option; without `-p`, ports are random and will not work behind a firewall.
- `5000/5001` are **not** required when using `-p`.

## Avahi / mDNS

```sh
sudo systemctl enable --now avahi-daemon
systemctl is-active avahi-daemon
```

Conflict check: `systemd-resolved` has mDNS disabled (`-mDNS`) on this machine, so Avahi owns port 5353. Verify with `resolvectl status`.

## Cloudflare WARP

Do not uninstall or permanently change it. Original state on this machine: `warp-svc` inactive and disabled.

- WARP's default split-tunnel already excludes `192.168.0.0/16` and `224.0.0.0/24`, so mDNS and local traffic work while connected.
- If your WARP build does not exclude the LAN, add a split-tunnel entry for the local subnet and `224.0.0.251`, or disconnect WARP temporarily for the test, then restore it.
- Test result: mirroring and discovery work with WARP connected.

Restore after testing:

```sh
warp-cli --accept-tos disconnect
sudo systemctl disable --now warp-svc
```

## Run command

Default (software decode, Wayland sink, windowed):

```sh
uxplay -n AirControl -nh -p -vs waylandsink
```

Fullscreen at iPhone XR native resolution:

```sh
uxplay -n AirControl -nh -p -fs -s 828x1792 -vs waylandsink
```

- `-p`: legacy ports (must match the firewall rules).
- `-nh`: do not append `@hostname` to the service name.
- `-vs waylandsink`: best Wayland sink on this machine.
- Default decoder is software (`avdec_h264` via `decodebin`).

## Troubleshooting

1. PC not in iPhone Screen Mirroring list: check firewall → WARP → Avahi service → router client isolation → different subnet.
2. Client connects but no video: try `-vs glimagesink` or `-vs autovideosink`; check GStreamer plugins.
3. Audio missing: three UDP ports are required (audio data); reopen `6000,6001,7011/udp`.
4. Remove the rules: delete by number from `sudo ufw status numbered`, or restore the backup.

## Reboot reproducibility

Avahi is enabled and the firewall rules persist. UxPlay is started manually (not a systemd service). Re-run the command after reboot and re-test discovery.
