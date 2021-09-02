import React, { forwardRef } from "react"
import Flex from "@netdata/netdata-ui/lib/components/templates/flex"
import useHover from "@/components/useHover"
import withChart from "@/components/hocs/withChart"
import { useChart, useAttributeValue } from "@/components/provider"
import Legend from "./legend"
import Header from "./header"
import Details from "./details"
import DimensionFilter from "./dimensionFilter"
import ChartContentWrapper from "./chartContentWrapper"
import FilterToolbox from "./filterToolbox"

export const Container = forwardRef((props, ref) => (
  <Flex
    ref={ref}
    data-testid="chart"
    border={{ color: "borderSecondary", side: "all" }}
    column
    round
    {...props}
  />
))

export const Footer = props => (
  <Flex border={{ side: "top", color: "borderSecondary" }} data-testid="chartLegend" {...props} />
)

export const ContentWrapper = props => (
  <Flex position="relative" column flex={true} data-testid="contentWrapper" {...props} />
)

export const Line = props => {
  const chart = useChart()
  const composite = useAttributeValue("composite")
  const detailed = useAttributeValue("detailed")

  const ref = useHover({
    onHover: chart.focus,
    onBlur: chart.blur,
    isOut: node => !node || !node.closest("[data-toolbox]"),
  })

  return (
    <Container ref={ref} {...props}>
      <Header />
      {composite && <FilterToolbox />}
      <ContentWrapper>
        <ChartContentWrapper />
        {detailed && <Details />}
      </ContentWrapper>
      {!detailed && (
        <Footer>
          <DimensionFilter />
          <Legend />
        </Footer>
      )}
    </Container>
  )
}

export default withChart(Line)