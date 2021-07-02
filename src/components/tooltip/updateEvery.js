import React from "react"
import { TextMicro } from "@netdata/netdata-ui/lib/components/typography"
import Flex from "@netdata/netdata-ui/lib/components/templates/flex"

const UpdateEvery = ({ chart }) => {
  const { updateEvery } = chart.getPayload()

  return (
    <Flex gap={1} data-testid="chartTooltip-collection">
      <TextMicro color="textLite">Collection:</TextMicro>
      <TextMicro color="textDescription">every {updateEvery}s</TextMicro>
    </Flex>
  )
}

export default UpdateEvery
