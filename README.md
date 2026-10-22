# AirControl

Local-only, open-source desktop tool for Linux (Windows later) that mirrors an iPhone screen to the PC over WiFi and offers file transfer.

The iPhone pairs by scanning a QR code shown by the PC app, which opens a local web page. Mirroring uses the AirPlay protocol via UxPlay running as a managed child process. There is no cloud, no accounts and no public API. Everything runs on the local network.

## Status

Early scaffold (v0.1.0). No application logic yet.

## Known limitations

See [docs/known-limitations.md](docs/known-limitations.md).

## Roadmap

- v0.1: mirror + QR pairing + consent + file transfer
- v0.2: WDA touch control
- v0.3: Windows + Bluetooth HID mode

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
