import React from "react"
import { TextMicro } from "@netdata/netdata-ui/lib/components/typography"
import Flex from "@netdata/netdata-ui/lib/components/templates/flex"
import { useChart } from "@/components/provider"

const UpdateEvery = () => {
  const chart = useChart()
  const { viewUpdateEvery = 0 } = chart.getPayload()

  return (
    <Flex gap={1} data-testid="chartPopover-collection">
      <TextMicro color="textLite">Collection:</TextMicro>
      <TextMicro color="textDescription">every {viewUpdateEvery}s</TextMicro>
    </Flex>
  )
}

export default UpdateEvery
