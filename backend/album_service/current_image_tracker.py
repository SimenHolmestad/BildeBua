from typing import Optional, Sequence
import os
from .image_name_formatter import format_image_name

DEFAULT_ALLOWED_EXTENSIONS = (".jpg", ".png")
DEFAULT_IMAGE_NUMBER_FILENAME = ".image_number.txt"


def get_next_image_name(
    album_folder_path: str,
    images_folder_path: str,
    image_name_prefix: str,
    file_extension: str,
    allowed_file_extensions: Sequence[str] = DEFAULT_ALLOWED_EXTENSIONS,
    image_number_filename: str = DEFAULT_IMAGE_NUMBER_FILENAME
) -> str:
    next_image_number = _get_current_image_number(
        album_folder_path,
        images_folder_path,
        image_name_prefix,
        allowed_file_extensions,
        image_number_filename
    ) + 1
    return format_image_name(image_name_prefix, next_image_number, file_extension)


def increase_image_number(
    album_folder_path: str,
    images_folder_path: str,
    image_name_prefix: str,
    allowed_file_extensions: Sequence[str] = DEFAULT_ALLOWED_EXTENSIONS,
    image_number_filename: str = DEFAULT_IMAGE_NUMBER_FILENAME
) -> None:
    current_number = _get_current_image_number(
        album_folder_path,
        images_folder_path,
        image_name_prefix,
        allowed_file_extensions,
        image_number_filename
    )
    _write_image_number_file(album_folder_path, image_number_filename, current_number + 1)


def get_name_of_last_image(
    album_folder_path: str,
    images_folder_path: str,
    image_name_prefix: str,
    allowed_file_extensions: Sequence[str] = DEFAULT_ALLOWED_EXTENSIONS,
    image_number_filename: str = DEFAULT_IMAGE_NUMBER_FILENAME
) -> Optional[str]:
    current_image_number = _get_current_image_number(
        album_folder_path,
        images_folder_path,
        image_name_prefix,
        allowed_file_extensions,
        image_number_filename
    )
    if current_image_number == 0:
        return None

    for extension in allowed_file_extensions:
        possible_filename = format_image_name(image_name_prefix, current_image_number, extension)
        if os.path.exists(os.path.join(images_folder_path, possible_filename)):
            return possible_filename

    raise RuntimeError(
        "Last image did not have one of allowed file extensions " + str(allowed_file_extensions)
    )


def _create_image_number_file_if_not_exists(
    album_folder_path: str,
    image_number_filename: str
) -> None:
    image_number_path = os.path.join(album_folder_path, image_number_filename)
    if not os.path.exists(image_number_path):
        with open(image_number_path, "w") as file_handle:
            file_handle.write("0")


def _write_image_number_file(
    album_folder_path: str,
    image_number_filename: str,
    image_number: int
) -> None:
    with open(os.path.join(album_folder_path, image_number_filename), "w") as file_handle:
        file_handle.write(str(image_number))


def _read_image_number_file(
    album_folder_path: str,
    image_number_filename: str
) -> int:
    with open(os.path.join(album_folder_path, image_number_filename), "r") as file_handle:
        return int(file_handle.read())


def _get_current_image_number(
    album_folder_path: str,
    images_folder_path: str,
    image_name_prefix: str,
    allowed_file_extensions: Sequence[str],
    image_number_filename: str
) -> int:
    _create_image_number_file_if_not_exists(album_folder_path, image_number_filename)
    _ensure_image_number_file_correct(
        album_folder_path,
        images_folder_path,
        image_name_prefix,
        allowed_file_extensions,
        image_number_filename
    )
    return _read_image_number_file(album_folder_path, image_number_filename)


def _ensure_image_number_file_correct(
    album_folder_path: str,
    images_folder_path: str,
    image_name_prefix: str,
    allowed_file_extensions: Sequence[str],
    image_number_filename: str
) -> None:
    if not _image_number_file_correct(
        album_folder_path,
        images_folder_path,
        image_name_prefix,
        allowed_file_extensions,
        image_number_filename
    ):
        _recreate_image_number_file(
            album_folder_path,
            images_folder_path,
            image_number_filename
        )


def _image_number_file_correct(
    album_folder_path: str,
    images_folder_path: str,
    image_name_prefix: str,
    allowed_file_extensions: Sequence[str],
    image_number_filename: str
) -> bool:
    image_number = _read_image_number_file(album_folder_path, image_number_filename)
    if not _image_with_image_number_exists(images_folder_path, image_name_prefix, allowed_file_extensions, image_number):
        return False

    next_image_number = image_number + 1
    if _image_with_image_number_exists(images_folder_path, image_name_prefix, allowed_file_extensions, next_image_number):
        return False

    return True


def _image_with_image_number_exists(
    images_folder_path: str,
    image_name_prefix: str,
    allowed_file_extensions: Sequence[str],
    image_number: int
) -> bool:
    for extension in allowed_file_extensions:
        if _image_with_number_and_extension_exists(images_folder_path, image_name_prefix, image_number, extension):
            return True

    return False


def _image_with_number_and_extension_exists(
    images_folder_path: str,
    image_name_prefix: str,
    image_number: int,
    extension: str
) -> bool:
    possible_file_name = format_image_name(image_name_prefix, image_number, extension)
    return os.path.exists(os.path.join(images_folder_path, possible_file_name))


def _recreate_image_number_file(
    album_folder_path: str,
    images_folder_path: str,
    image_number_filename: str
) -> None:
    image_names = sorted(os.listdir(images_folder_path))
    if not image_names:
        image_number = 0
    else:
        last_name = image_names[-1]
        image_number = _get_image_number_from_filename(last_name)

    _write_image_number_file(album_folder_path, image_number_filename, image_number)


def _get_image_number_from_filename(filename: str) -> int:
    return int(filename.split(".")[0][-4:])
