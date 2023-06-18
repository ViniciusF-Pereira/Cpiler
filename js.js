var htmlEditor = ace.edit("htmlEditor");
htmlEditor.setTheme("ace/theme/monokai");
htmlEditor.session.setMode("ace/mode/html");
htmlEditor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
});

var cssEditor = ace.edit("cssEditor");
cssEditor.setTheme("ace/theme/monokai");
cssEditor.session.setMode("ace/mode/css");
cssEditor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
});

var jsEditor = ace.edit("jsEditor");
jsEditor.setTheme("ace/theme/monokai");
jsEditor.session.setMode("ace/mode/javascript");
jsEditor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true
});

function changeLanguage(languageId) {
    htmlEditor.container.style.display = 'none';
    cssEditor.container.style.display = 'none';
    jsEditor.container.style.display = 'none';


    if (languageId === 'html') {
        htmlEditor.container.style.display = 'block';
        htmlEditor.focus();
    } else if (languageId === 'css') {
        cssEditor.container.style.display = 'block';
        cssEditor.focus();
    } else if (languageId === 'javascript') {
        jsEditor.container.style.display = 'block';
        jsEditor.focus();
    }
}

function clearEditor() {
    var activeEditor = getActiveEditor();
    activeEditor.setValue('');
    activeEditor.focus();
}

function compileCode() {
    var htmlCode = htmlEditor.getValue();
    var cssCode = cssEditor.getValue();
    var jsCode = jsEditor.getValue();

    var compiledCode = htmlCode;

    if (cssCode.trim() !== '') {
        var cssLink = '<style>' + cssCode + '</style>';
        compiledCode = compiledCode.replace(/<\/head>/i, cssLink + '</head>');
    }

    if (jsCode.trim() !== '') {
        var jsScript = '<script>' + jsCode + '</script>';
        compiledCode = compiledCode.replace(/<\/body>/i, jsScript + '</body>');
    }

    var resultWindow = window.open();
    resultWindow.document.write(compiledCode);
    resultWindow.document.close();
}

function getActiveEditor() {
    if (htmlEditor.container.style.display === 'block') {
        return htmlEditor;
    } else if (cssEditor.container.style.display === 'block') {
        return cssEditor;
    } else if (jsEditor.container.style.display === 'block') {
        return jsEditor;
    }
    return htmlEditor;
}

var htmlPreviewFrame = document.getElementById('htmlPreviewFrame');

// Adiciona um evento de escuta para detectar a alteração no editor HTML
htmlEditor.session.on('change', function() {
    // Obtém o código HTML atualizado
    var htmlCode = htmlEditor.getValue();

    // Verifica se o código HTML contém a tag de link para um arquivo externo
    if (htmlCode.includes('<link rel="stylesheet" href="css.css" />')) {
        // Obtém o código CSS do editor CSS
        var cssCode = cssEditor.getValue();

        // Adiciona o link CSS ao código HTML
        var updatedHtmlCode = htmlCode.replace('<link rel="stylesheet" href="css.css" />', '<style>' + cssCode + '</style>');

        // Atualiza o conteúdo do quadro de visualização HTML
        htmlPreviewFrame.srcdoc = updatedHtmlCode;
    } else {
        // Se não houver tag de link para um arquivo externo, atualiza o quadro de visualização HTML com o código HTML original
        htmlPreviewFrame.srcdoc = htmlCode;
    }
});

cssEditor.session.on('change', function() {
    // Obtém o código CSS atualizado
    var cssCode = cssEditor.getValue();

    // Atualiza o quadro de visualização HTML com o novo código CSS
    var iframeDocument = htmlPreviewFrame.contentDocument || htmlPreviewFrame.contentWindow.document;
    var styleElement = iframeDocument.createElement('style');
    styleElement.innerHTML = cssCode;
    iframeDocument.head.appendChild(styleElement);
});

function toggleActive(button) {
    var buttons = document.querySelectorAll('.btns button');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}