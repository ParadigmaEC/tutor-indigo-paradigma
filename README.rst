Paradigma theme for Tutor
=========================

Tema clásico de Paradigma para el LMS y Studio de `Open edX <https://openedx.org>`__, basado en
Tutor Indigo y alineado con `paradigma.ec <https://paradigma.ec>`__.

Responsabilidades
-----------------

Este repositorio controla exclusivamente:

* plantillas Django/Mako del LMS y Studio;
* Sass, tipografías, logos y páginas estáticas compiladas en la imagen ``openedx``;
* configuración clásica de Tutor necesaria para activar el tema ``indigo``.

Las aplicaciones React servidas bajo ``apps.learn.paradigma.ec`` pertenecen al repositorio
``openedx-mfe-theme-paradigma`` y a su plugin ``paradigma_mfe``. Este plugin no instala
``@edx/brand``, no configura ``PARAGON_THEME_URLS``, no registra slots de MFEs y no cambia la
imagen Docker de las MFEs. Esta separación evita estilos dependientes del orden de carga y
configuraciones runtime contradictorias.

Instalación
-----------

Instale este paquete y el tema MFE por separado, habilite ambos plugins y regenere la
configuración::

    pip install --no-deps /ruta/tutor-indigo-paradigma
    pip install --no-deps /ruta/openedx-mfe-theme-paradigma
    tutor plugins enable indigo
    tutor plugins enable paradigma_mfe
    tutor config save

Para compilar los cambios clásicos y reiniciar Open edX::

    tutor images build openedx
    tutor local restart lms cms

Los cambios normales del tema MFE siguen el flujo de publicación documentado en
``openedx-mfe-theme-paradigma`` y no requieren recompilar ``openedx``.

Configuración
-------------

* ``INDIGO_WELCOME_MESSAGE``: ``Ideas que transforman.``
* ``INDIGO_PRIMARY_COLOR``: ``#050505``
* ``INDIGO_FOOTER_NAV_LINKS``: enlaces públicos y legales de Paradigma
* ``INDIGO_ENABLE_DARK_TOGGLE``: activa el selector del tema clásico

Ejemplo::

    tutor config save --set 'INDIGO_PRIMARY_COLOR="#050505"'

Identidad visual
----------------

La implementación comparte con el tema MFE la paleta carbón/marfil, cuerpo Helvetica Neue,
controles CS Genio Mono, encabezados Dozed y Dx Monstral únicamente para momentos hero. Los
componentes usan radios contenidos de 1–4 px; las formas pill se reservan para componentes que lo
requieran semánticamente.

Los puntos principales de edición son:

* ``tutorindigo/templates/indigo/lms/static/sass/partials/lms/theme``
* ``tutorindigo/templates/indigo/cms/static/sass/partials/cms/theme``
* ``tutorindigo/templates/indigo/lms/templates``
* ``brand-assets``

Validación
----------

Antes de publicar::

    make test-lint
    make test-format
    python -m build --sdist

Revise login, registro, páginas estáticas, dashboard clásico, Studio, formularios, estados de foco
y ambos temas de color. Las MFEs se validan desde el repositorio complementario.

Licencia
--------

Este trabajo se distribuye bajo GNU Affero General Public License v3.
