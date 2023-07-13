// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
  
use tauri::Manager;
use window_vibrancy::NSVisualEffectMaterial;

mod plugins;
  
fn main() {
    let mut builder = tauri::Builder::default();

    #[cfg(target_os = "macos")] {
        builder = builder.menu(tauri::Menu::os_default("feeds"));
    }

    builder = builder.setup(|handle| {
        let window = handle.get_window("main").unwrap();

        #[cfg(target_os = "macos")]
        window_vibrancy::apply_vibrancy(&window, NSVisualEffectMaterial::Sidebar, None, Some(12.0)).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
        
        #[cfg(target_os = "windows")]
        window_vibrancy::apply_blur(&window, Some((0, 0, 0, 0))).expect("Unsupported platform! 'apply_blur' is only supported on Windows");

        #[cfg(debug_assertions)] {
            window.open_devtools();
        }

        Ok(())
    });

    builder = builder.invoke_handler(tauri::generate_handler![
        plugins::load_feeds,
        plugins::load_detail,
    ]);

    builder.run(tauri::generate_context!())
        .expect("error while running application");
}
  