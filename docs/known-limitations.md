# Known limitations (Milestone 1 measurements)

Feasibility proof only. No application code added. UxPlay remains an external dependency.

## Environment

- PC: Omarchy 4.0.4 (Arch-based), Hyprland on Wayland, AMD RX 5500M (discrete) + Radeon Vega (iGPU).
- iPhone: iPhone XR, iOS 18.7.9.
- Network: 2.4 GHz Wi-Fi; PC and iPhone on the same local subnet.
- UxPlay 1.73.7 (pacman), Avahi 1:0.9rc5, UFW, Cloudflare WARP 2026.7.1377.

## Results

| Measurement                             | Result                                                                                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery (PC in Screen Mirroring list) | Yes — service name "AirControl"                                                                                                                 |
| Connection / first frame                | Yes, within a few seconds of tapping                                                                                                            |
| End-to-end latency                      | ~100 ms average (min/max not recorded; target 100–200 ms). Method: stopwatch on iPhone, ~10 photos of phone + PC screen side by side, averaged. |
| Frame smoothness                        | Smooth                                                                                                                                          |
| Audio sync                              | Good                                                                                                                                            |
| Video quality                           | Slightly soft / not sharp                                                                                                                       |
| CPU (uxplay)                            | ~14–15% during mirroring; system ~4–6% user                                                                                                     |
| GPU VRAM                                | ~11.7 MB used                                                                                                                                   |
| GPU busy %                              | Not readable via sysfs on the discrete GPU (`gpu_busy_percent` returns EBUSY)                                                                   |
| Stability                               | Connected for the test; no disconnect observed; lock/unlock and rotation handled without glitches (user-reported)                               |
| WARP connected                          | Discovery + mirroring + audio all work                                                                                                          |
| Reboot reproducibility                  | Not exercised in this session; Avahi + firewall rules persist, UxPlay is manual                                                                 |

## What failed / limitations

- **Hardware decode:** Vulkan Video element `vulkanh264device1dec` crashes UxPlay on client connection. The VAAPI GStreamer plugin is not available in the stock repos (only an orphaned AUR package), so software decode (`avdec_h264`) is used.
- **GPU busy %** is not exposed for the discrete GPU via sysfs on this kernel/driver.
- **Video quality** is slightly soft at the tested resolutions.
- **10-minute continuous run** was not instrumented to completion (config changes interrupted sampling); recommend a dedicated rerun before Milestone 2.
- **Reboot reproducibility** was not actually tested end to end.
- UxPlay is not registered as a systemd service; it must be started manually.

## Verdict

**GO** for continuing the project: discovery works, connection is stable, latency ~100 ms is within the 100–200 ms target, audio sync is good, and it works with WARP connected. Blockers to address before the app: hardware decode unavailable (software decode only), video quality slightly soft, and reboot reproducibility not yet verified.
