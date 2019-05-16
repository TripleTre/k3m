export function fileReader(elementId, onRead) {
  const element = document.getElementById(elementId);
  const reader = new FileReader();

  element.addEventListener('change', e => {
    const file = e.target.files[0];

    if (/image/.test(file.type)) {
      reader.readAsDataURL(file)
    }
  });

  reader.onload = function() {
    const image = new Image();
    image.src = reader.result;
    image.onload = function() {
      onRead(image);
    }
  };
}
