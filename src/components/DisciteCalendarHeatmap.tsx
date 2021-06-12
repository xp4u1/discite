import * as React from "react";
import Calendar from "../lib/Calendar";

import { shiftDate } from "../middleware/Calendar";
import { database } from "../middleware/Storage";
import ReactTooltip from "react-tooltip";
import { useLiveQuery } from "dexie-react-hooks";
import { median } from "../utils";
import dayjs from "dayjs";

const { useState, useEffect, useCallback } = React;

const colors = {
  light: ["#eeeeee", "#9BE9A8", "#40C463", "#30A14E", "#216E39"],
  dark: ["#303030", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

const DisciteCalendarHeatmap: React.FC = () => {
  const [endDate] = useState(shiftDate(new Date(), 14));
  const [values, setValues] = useState({});
  const [colorScheme, setColorScheme] = useState(
    document.body.classList.contains("dark") ? colors.dark : colors.light
  );
  const stats = useLiveQuery(() => database.stats.toArray());

  const getData = useCallback(async () => {
    const tmp: { [date: string]: number } = {};
    const data: { [date: string]: { value: number; color: string } } = {};

    const date = dayjs(Date.now()).startOf("day").toDate();

    const entries = await database.activity
      .where("date")
      // 32161726 s sind etwa ein Jahr und eine Woche
      .between(date.getTime() - 32161726000, +dayjs(date).endOf("day"))
      .toArray();

    // Anzahl von Tagen (worst case):
    //  max. Breite * Höhe
    //  = 53 * 7
    //  = 371
    for (let index = 0; index < 371; index++) {
      const entry = entries.filter((entry) => entry.date === date.getTime())[0];
      tmp[date.toISOString().slice(0, 10)] = entry ? entry.count : 0;

      date.setDate(date.getDate() - 1);
    }

    // Relative Werte für die Farben ermitteln.
    const middle = median(Object.values(tmp).filter((value) => value !== 0));
    Object.entries(tmp).forEach((entry) => {
      const [date, value] = entry;
      let color = colorScheme[0];

      if (value > 0 && value <= middle / 2) color = colorScheme[1];
      else if (value > middle / 2 && value <= middle) color = colorScheme[2];
      else if (value > middle && value <= middle * 2) color = colorScheme[3];
      else if (value > middle * 2) color = colorScheme[4];

      data[date] = {
        value: value,
        color: color,
      };
    });

    return data;
  }, [colorScheme]);

  useEffect(() => {
    // Fake-Daten
    getData().then((data) => setValues(data));

    // Auf Änderungen warten:
    const check = () =>
      document.body.classList.contains("dark")
        ? setColorScheme(colors.dark)
        : setColorScheme(colors.light);
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true });

    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 500);
  }, [getData]);

  // Ansicht aktualisieren, wenn in der Datenbank etwas geändert wird
  // oder das Farbthema gewechselt wird.
  useEffect(() => {
    getData().then((data) => setValues(data));
  }, [stats, colorScheme, getData]);

  return (
    <section className="calendar">
      {/* @ts-ignore */}
      <Calendar
        values={values}
        defaultColor={colorScheme[0]}
        until={endDate.toISOString().slice(0, 10)}
      />
      <ReactTooltip type={"dark"} effect="solid" />
    </section>
  );
};

export default DisciteCalendarHeatmap;
