export default sdk => {
  const offStart = sdk.on("highlightStart", chart => {
    if (chart.getAttribute("navigation") !== "highlight") return

    chart.getApplicableNodes({ syncHighlight: true }).forEach(node => {
      node.updateAttributes({ enabledHover: false, highlighting: true })
    })
  })

  const offEnd = sdk.on("highlightEnd", (chart, highlight) => {
    if (chart.getAttribute("navigation") !== "highlight") return

    chart.getApplicableNodes({ syncHighlight: true }).forEach(node => {
      node.updateAttributes({
        enabledHover: true,
        highlighting: false,
        highlight,
      })
    })
  })

  return () => {
    offStart()
    offEnd()
  }
}
