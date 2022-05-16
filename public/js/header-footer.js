function loadComponentToId(nodeId, component) {
    fetch(component)
      .then(res => res.text())
      .then(body => document.querySelector(nodeId).innerHTML = body)
  }

  loadComponentToId("#header-placeholder", "../html/components/header.html");
  loadComponentToId("#footer-placeholder", "../html/components/footer.html");