const $ = id => document.getElementById(id);

const input = $("htmlInput");
const preview = $("preview");

function escapeText(value){
  return String(value || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

function render(){

  const html = input.value;
  const orientation = $("orientation").value;
  const margin = $("margin").value;

  const paper = document.createElement("div");
  paper.className = "paper" + (
    orientation === "landscape" ? " landscape" : ""
  );

  paper.style.padding = `${margin}mm`;

  if(!html.trim()){
    paper.innerHTML = `
      <div class="empty">
        Paste HTML into the editor to preview it here.
      </div>
    `;
  }else{
    /*
      We intentionally render the user's HTML as HTML rather than
      escaping it. This is the compiler's main purpose.
    */
    paper.innerHTML = html;
  }

  preview.replaceChildren(paper);
}

function getFileName(){
  const firstHeading =
    preview.querySelector("h1,h2,title");

  let name = firstHeading
    ? firstHeading.textContent.trim()
    : "xark-document";

  name = name
    .replace(/[\\/:*?"<>|]/g,"")
    .replace(/\s+/g,"-")
    .slice(0,70);

  return name || "xark-document";
}

async function downloadPDF(){

  if(!input.value.trim()){
    alert("Please paste some HTML first.");
    return;
  }

  render();

  const element = preview.querySelector(".paper");

  const orientation =
    $("orientation").value;

  const margin =
    Number($("margin").value);

  const pageFormat =
    $("pageSize").value;

  const options = {
    margin: margin,
    filename: `${getFileName()}.pdf`,
    image: {
      type: "jpeg",
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    },
    jsPDF: {
      unit: "mm",
      format: pageFormat,
      orientation: orientation
    },
    pagebreak: {
      mode: ["css","legacy"]
    }
  };

  await html2pdf()
    .set(options)
    .from(element)
    .save();
}

function clearAll(){
  input.value = "";
  render();
}

$("previewBtn").addEventListener("click", render);
$("pdfBtn").addEventListener("click", downloadPDF);
$("clearBtn").addEventListener("click", clearAll);

$("printBtn").addEventListener("click", () => {
  render();
  window.print();
});

input.addEventListener("input", render);
$("orientation").addEventListener("change", render);
$("margin").addEventListener("change", render);
$("pageSize").addEventListener("change", render);

render();
