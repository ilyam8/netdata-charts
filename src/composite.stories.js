import React from "react"
import { ThemeProvider } from "styled-components"
import { DefaultTheme } from "@netdata/netdata-ui/lib/theme"
import { camelizeKeys } from "@/helpers/objectTransform"
import Chart from "@/components/chart"
import makeMockPayload from "@/helpers/makeMockPayload"
import makeDefaultSDK from "./makeDefaultSDK"

import systemCpuChart from "@/fixtures/compositeSystemCpuChart"
import systemCpu from "@/fixtures/compositeSystemCpu"

const metadata = camelizeKeys(systemCpuChart, { omit: ["dimensions"] })

const getChartMetadata = () => metadata
const getChart = makeMockPayload(systemCpu, { delay: 600 })

export const Simple = () => {
  const sdk = makeDefaultSDK({ getChartMetadata })
  const chart = sdk.makeChart({ getChart, attributes: { composite: true } })
  sdk.appendChild(chart)

  return (
    <ThemeProvider theme={DefaultTheme}>
      <Chart chart={chart} />
    </ThemeProvider>
  )
}

export default {
  title: "Composite Charts",
  component: Simple,
}