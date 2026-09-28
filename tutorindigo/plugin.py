from __future__ import annotations

import os
import typing as t
from glob import glob

import importlib_resources
from tutor import hooks
from tutor.__about__ import __version_suffix__

from .__about__ import __version__

# Handle version suffix in main mode, just like tutor core.
if __version_suffix__:
    __version__ += "-" + __version_suffix__


################# Configuration
config: t.Dict[str, t.Dict[str, t.Any]] = {
    "defaults": {
        "VERSION": __version__,
        "WELCOME_MESSAGE": "Ideas que transforman.",
        "PRIMARY_COLOR": "#050505",
        "ENABLE_DARK_TOGGLE": True,
        # Footer links are dictionaries with a "title" and a "url".
        # To remove all links:
        # tutor config save --set INDIGO_FOOTER_NAV_LINKS=[]
        "FOOTER_NAV_LINKS": [
            {"title": "Nosotros", "url": "https://paradigma.ec/about"},
            {"title": "Servicios", "url": "https://paradigma.ec/services"},
            {"title": "Contacto", "url": "https://paradigma.ec/contact"},
            {"title": "Privacidad", "url": "https://paradigma.ec/policy/privacy/"},
            {"title": "Términos", "url": "https://paradigma.ec/policy/terms/"},
        ],
    },
    "unique": {},
    "overrides": {},
}


# Render only the classic LMS/Studio theme. React MFEs are owned by the
# paradigma_mfe companion plugin in openedx-mfe-theme-paradigma.
hooks.Filters.ENV_TEMPLATE_ROOTS.add_item(
    str(importlib_resources.files("tutorindigo") / "templates")
)
hooks.Filters.ENV_TEMPLATE_TARGETS.add_item(("indigo", "build/openedx/themes"))

# Force rendering of SCSS files even though they live in partial directories.
hooks.Filters.ENV_PATTERNS_INCLUDE.add_items(
    [
        r"indigo/lms/static/sass/partials/lms/theme/",
        r"indigo/cms/static/sass/partials/cms/theme/",
    ]
)


# Set the theme automatically during Tutor initialization.
with open(
    os.path.join(
        str(importlib_resources.files("tutorindigo") / "templates"),
        "indigo",
        "tasks",
        "init.sh",
    ),
    encoding="utf-8",
) as task_file:
    hooks.Filters.CLI_DO_INIT_TASKS.add_item(("lms", task_file.read()))


# Give the classic Open edX image a distinct tag. Do not rename or rebuild the
# MFE image: paradigma_mfe supplies its runtime theme and optional image layer.
@hooks.Filters.CONFIG_DEFAULTS.add(priority=hooks.priorities.LOW)
def _override_openedx_docker_image(
    items: list[tuple[str, t.Any]],
) -> list[tuple[str, t.Any]]:
    openedx_image = ""
    for key, value in items:
        if key == "DOCKER_IMAGE_OPENEDX":
            openedx_image = value
    if openedx_image:
        items.append(("DOCKER_IMAGE_OPENEDX", f"{openedx_image}-indigo"))
    return items


hooks.Filters.CONFIG_DEFAULTS.add_items(
    [(f"INDIGO_{key}", value) for key, value in config["defaults"].items()]
)
hooks.Filters.CONFIG_UNIQUE.add_items(
    [(f"INDIGO_{key}", value) for key, value in config["unique"].items()]
)
hooks.Filters.CONFIG_OVERRIDES.add_items(list(config["overrides"].items()))


# Register only edx-platform patches. Loading the bundled MFE patches or React
# components here would override theme URLs, logos, plugin slots, and Docker
# inputs managed by paradigma_mfe.
for path in glob(
    os.path.join(str(importlib_resources.files("tutorindigo") / "patches"), "openedx-*")
):
    with open(path, encoding="utf-8") as patch_file:
        hooks.Filters.ENV_PATCHES.add_item((os.path.basename(path), patch_file.read()))
