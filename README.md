# Alerta Temprana

Aplicación comunitaria para la alerta temprana de eventos ambientales y emergencias, desarrollada por Guardianes Arroyos.

## ¿Cómo podés usar esta app?

La app ofrece dos formas de uso, para adaptarse a distintas necesidades y dispositivos:

### 1. Modo Página Web

Podés acceder a la app directamente desde cualquier navegador web:
- **Simplemente visitá:** [https://guardianesarroyos.github.io/Alerta-Temprana-1/](https://guardianesarroyos.github.io/Alerta-Temprana-1/)
- No requiere instalación.
- Compatible con computadoras y dispositivos móviles.

### 2. Modo App Instalable (PWA)

Si preferís tener la app instalada en tu celular (como una aplicación nativa y usar), podés hacerlo gracias a la tecnología PWA:
- Accedé a la web desde tu navegador móvil.
- Buscá la opción "Agregar a la pantalla de inicio" (generalmente aparece en el menú del navegador).
- ¡Listo! Ahora tendrás el icono de la app. acceso directo como si fuera una app instalada, y podras usar la simulación y correlaciones aún sin internet!

**Ventajas del modo PWA:**  
- Acceso offline a funciones básicas.
- Mejor integración con tu dispositivo móvil.
- Experiencia similar a una aplicación nativa.

---

## ¿Para qué sirve esta app?

- Recibir y enviar alertas ambientales en tiempo real.
- Compartir información útil con la comunidad.
- Visualizar mapas y reportes actualizados.

## Colaborá o reportá un problema

Este proyecto es abierto y colaborativo. Si querés proponer mejoras, informar un error o sumarte al desarrollo, ¡te invitamos a participar!

- [Abrí un issue](https://github.com/guardianesarroyos/Alerta-Temprana-1/issues)
- [Proponé un pull request](https://github.com/guardianesarroyos/Alerta-Temprana-1/pulls)

---

### Créditos
Desarrollado por Guardianes Arroyos y la comunidad.

---

## Configuración de la API Key de Wunderground

Por motivos de seguridad, la clave de API de Wunderground **no está incluida en este repositorio**.

Para que la aplicación funcione correctamente en tu entorno local, debes crear un archivo llamado `config.local.js` en la raíz del proyecto con el siguiente contenido:

```js
window.WU_API_KEY = "TU_API_KEY_AQUI";
```
> **Importante:**  
Si no tienes una clave, solicita acceso al administrador del proyecto.

---
