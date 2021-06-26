/**
 * react-github-contribution-calendar
 * Forked from: https://github.com/haripo/react-github-contribution-calendar
 * License: MIT
 */

import React, { ReactElement } from "react";
import dayjs from "dayjs";
import Measure, { BoundingRect } from "react-measure";
import ReactTooltip from "react-tooltip";

interface Props {
  weekNames: string[];
  monthNames: string[];
  values: { [date: string]: { value: number; color: string } };
  defaultColor: string;
  until: string;
  dateFormat: string;
}

interface State {
  columns: number;
  maxWidth: number;
}

export default class GitHubCalendar extends React.Component<Props, State> {
  monthLabelHeight: number;
  weekLabelWidth: number;
  panelSize: number;
  panelMargin: number;

  constructor(props: any) {
    super(props);

    this.monthLabelHeight = 15;
    this.weekLabelWidth = 15;
    this.panelSize = 11;
    this.panelMargin = 2;

    this.state = {
      columns: 53,
      maxWidth: 53,
    };
  }

  getPanelPosition(row: number, col: number) {
    const bounds = this.panelSize + this.panelMargin;
    return {
      x: this.weekLabelWidth + bounds * row,
      y: this.monthLabelHeight + bounds * col,
    };
  }

  makeCalendarData(
    history: { [date: string]: { value: number; color: string } },
    lastDay: string,
    columns: number
  ) {
    const d = dayjs(lastDay, { format: this.props.dateFormat });
    const lastWeekend = d.endOf("week");
    const endDate = d.endOf("day");

    let result: ({ value: number; color: string; month: number } | null)[][] =
      [];
    for (let i = 0; i < columns; i++) {
      result[i] = [];
      for (let j = 0; j < 7; j++) {
        let date = lastWeekend.subtract((columns - i - 1) * 7 + (6 - j), "day");
        if (date <= endDate) {
          const { value = 0, color = this.props.defaultColor } =
            history[date.format(this.props.dateFormat)] || {};
          result[i][j] = {
            value: value,
            color: color,
            month: date.month(),
          };
        } else {
          result[i][j] = null;
        }
      }
    }

    return result;
  }

  render() {
    const columns = this.state.columns;
    const values = this.props.values;
    const until = this.props.until;

    let contributions = this.makeCalendarData(values, until, columns);
    let innerDom: ReactElement[] = [];

    // panels
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < 7; j++) {
        let contribution = contributions[i][j];
        if (contribution === null) continue;
        const pos = this.getPanelPosition(i, j);
        const color = contribution.color;

        const rect = (
          <rect
            key={"panel_key_" + i + "_" + j}
            x={pos.x}
            y={pos.y}
            rx="2"
            ry="2"
            width={this.panelSize}
            height={this.panelSize}
            fill={color}
            data-tip={`${contribution.value} Wiederholung${
              contribution.value !== 1 ? "en" : ""
            }`}
          />
        );

        innerDom.push(rect);
      }
    }

    // week texts
    for (let i = 0; i < this.props.weekNames.length; i++) {
      const textBasePos = this.getPanelPosition(0, i);
      const dom = (
        <text
          key={"week_key_" + i}
          style={{
            fontSize: 9,
            alignmentBaseline: "central",
            fill: "#AAA",
          }}
          x={textBasePos.x - this.panelSize / 2 - 4}
          y={textBasePos.y + this.panelSize / 2 + 1}
          textAnchor={"middle"}
        >
          {this.props.weekNames[i]}
        </text>
      );
      innerDom.push(dom);
    }

    // month texts
    let prevMonth = -1;
    for (let i = 0; i < columns; i++) {
      const c = contributions[i][0];
      if (c === null) continue;
      // Es dürfen keine zwei Monatsbezeichnungen hintereinander stehen,
      // denn sonst überlappen sie sich. Deshalb wird kein Monat ange-
      // zeigt, wenn in der ersten Spalte nur noch die letzte Woche
      // des letzten Monats steht.
      if (i === 0 && c.month !== contributions[i + 1][0]?.month) continue;
      if (c.month !== prevMonth) {
        let textBasePos = this.getPanelPosition(i, 0);
        innerDom.push(
          <text
            key={"month_key_" + i}
            style={{
              fontSize: 10,
              alignmentBaseline: "central",
              fill: "#AAA",
            }}
            x={textBasePos.x + this.panelSize / 2}
            y={textBasePos.y - this.panelSize / 2 - 2}
            textAnchor={"middle"}
          >
            {this.props.monthNames[c.month]}
          </text>
        );
      }
      prevMonth = c.month;
    }

    return (
      <Measure bounds onResize={(rect) => this.updateSize(rect.bounds)}>
        {({ measureRef }: any) => (
          <div ref={measureRef} style={{ width: "100%" }}>
            <svg
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Roboto", sans-serif',
                width: "100%",
              }}
              height="110"
            >
              {innerDom}
            </svg>
          </div>
        )}
      </Measure>
    );
  }

  updateSize(size?: BoundingRect) {
    if (!size) return;

    const visibleWeeks = Math.floor((size.width - this.weekLabelWidth) / 13);
    this.setState({
      columns: Math.min(visibleWeeks, this.state.maxWidth),
    });

    ReactTooltip.rebuild();
  }
}

// @ts-ignore
GitHubCalendar.defaultProps = {
  weekNames: ["Mo", "", "Mi", "", "Fr", "", "So"],
  monthNames: [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
  panelColors: ["#EEE", "#DDD", "#AAA", "#444"],
  dateFormat: "YYYY-MM-DD",
};
