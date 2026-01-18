from backend.core.settings import Settings


def _base_settings() -> Settings:
    return Settings.model_validate({
        "qr_codes": {
            "wifi": {
                "enabled": False
            }
        }
    })


def create_fast_dummy_settings() -> Settings:
    settings = _base_settings()
    settings.camera.module = "dummy"
    settings.camera.options = {
        "width": 120,
        "height": 80,
        "number_of_circles": 5,
        "min_circle_radius": 5,
        "max_circle_radius": 15
    }
    return settings


def create_faulty_dummy_settings() -> Settings:
    settings = create_fast_dummy_settings()
    settings.camera.options.update({
        "should_fail": True,
        "error_message": "This is a test error message",
        "verbose_errors": False
    })
    return settings


def create_dummy_raw_settings() -> Settings:
    settings = create_fast_dummy_settings()
    settings.camera.modules["dummy"]["needs_raw_file_transfer"] = True
    settings.camera.modules["dummy"]["raw_file_extension"] = ".cr2"
    return settings
