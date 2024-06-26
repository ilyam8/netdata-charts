import React, { forwardRef, useMemo } from "react"
import groupBy from "lodash/groupBy"
import isEmpty from "lodash/isEmpty"
import { Table, TextSmall } from "@netdata/netdata-ui"
import ChartContainer from "@/components/chartContainer"
import { useChart, useDimensionIds, useAttributeValue } from "@/components/provider"
import withChart from "@/components/hocs/withChart"
import { ChartWrapper } from "@/components/hocs/withTile"
import { uppercase } from "@/helpers/objectTransform"
import FontSizer from "@/components/helpers/fontSizer"
import { labelColumn, valueColumn, anomalyColumn, minColumn, avgColumn, maxColumn } from "./columns"

const keepoutRegex = ".*"
const keepRegex = "(" + keepoutRegex + ")"

const useColumns = (options = {}) => {
  const { period, dimensionIds, groups, labels, rowGroups, contextGroups } = options

  const hover = useAttributeValue("hoverX")

  return useMemo(() => {
    return [
      {
        id: "Instance",
        header: () => {
          console.log(1)
          return "Instance"
        },
        columns: labels.map(label =>
          labelColumn({ header: uppercase(label), partIndex: groups.findIndex(gi => gi === label) })
        ),
      },
      ...Object.keys(contextGroups).map(context => {
        return {
          id: `Context-${context}`,
          header: () => {
            console.log(2, context)
            return context
          },
          columns: Object.keys(contextGroups[context]).map(dimension =>
            valueColumn({ context, dimension, ...options })
          ),
        }
      }),
    ]
  }, [period, !!hover, dimensionIds])
}

const columnAttrs = ["context", "dimension"]

const groupByColumn = (result, ids, groups, attrs = columnAttrs) => {
  const [attr, ...restAttrs] = attrs
  const groupByRegex = new RegExp(
    groups.reduce((s, g) => {
      s = s + (s ? "," : "")

      if (attr === g) {
        s = s + keepRegex
      } else {
        s = s + keepoutRegex
      }

      return s
    }, "")
  )

  if (isEmpty(result)) {
    result = groupBy(ids, value => {
      const [, ...matches] = value.match(groupByRegex)
      return matches.join(",")
    })
  } else {
    Object.keys(result).forEach(key => {
      result[key] = groupBy(result[key], value => {
        const [, ...matches] = value.match(groupByRegex)
        return matches.join(",")
      })
    })
  }

  if (!restAttrs.length) return result

  return groupByColumn(result, ids, groups, restAttrs)
}

const Dimensions = () => {
  const dimensionIds = useDimensionIds()

  const tab = useAttributeValue("weightsTab")

  const chart = useChart()
  const groups = chart.getDimensionGroups()
  const tableColumns = chart.getAttribute("tableColumns")

  const [rowGroups, contextGroups, labels] = useMemo(() => {
    let forRows = []

    let groupByRegex = new RegExp(
      groups.reduce((s, g) => {
        s = s + (s ? "," : "")

        if (tableColumns.includes(g)) {
          s = s + keepoutRegex
        } else {
          s = s + keepRegex
          forRows.push(g)
        }

        return s
      }, "")
    )

    const baseGroup = groupBy(dimensionIds, value => {
      const [, ...matches] = value.match(groupByRegex)
      return matches.join(",")
    })

    let contextAndDimensionsGroup = groupByColumn({}, dimensionIds, groups, tableColumns)

    return [baseGroup, contextAndDimensionsGroup, forRows]
  }, [dimensionIds])

  const columns = useColumns({
    period: tab,
    groups,
    dimensionIds,
    labels,
    rowGroups,
    contextGroups,
  })

  return (
    <Table
      enableSorting
      // enableSelection
      dataColumns={columns}
      data={Object.keys(rowGroups).map(g => ({ key: g, ids: rowGroups[g], contextGroups }))}
      // onRowSelected={onItemClick}
      // onSearch={noop}
      // meta={meta}
      // sortBy={sortBy}
      // rowSelection={rowSelection}
      // onSortingChange={onSortByChange}
      // expanded={expanded}
      // onExpandedChange={onExpandedChange}
      // enableSubRowSelection={enableSubRowSelection}
      width="100%"
      // bulkActions={bulkActions}
      // rowActions={rowActions}
    />
  )
}

export const TableChart = forwardRef(({ uiName, ...rest }, ref) => (
  <ChartWrapper ref={ref}>
    <ChartContainer
      uiName={uiName}
      column
      alignItems="center"
      justifyContent="center"
      position="relative"
      {...rest}
    >
      <Dimensions />
    </ChartContainer>
  </ChartWrapper>
))

export default withChart(TableChart, { tile: true })
