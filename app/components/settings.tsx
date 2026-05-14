'use client'
import { useEffect, useState } from "react";

const Settings = () => {
  const options = ["€", "$", "£"];
  const [index, setIndex] = useState<number>(0);//options.indexOf((localStorage.getItem("money") ?? " "))
  const [measure,setMeasure] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("money",options[index]);
  },[index]);

  useEffect(() => {
    localStorage.setItem("measure", measure ? "1" : "0");
  },[measure]);

  const prev = () => setIndex((i) => (i === 0 ? options.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === options.length - 1 ? 0 : i + 1));

  return (<>
    <div className="selector">
      <button onClick={prev}>◀</button>
      <span>{options[index]}</span>
      <button onClick={next}>▶</button>
    </div>
    <div className="btn-group" role="group" aria-label="Basic example">
      <button type="button" className="btn btn-primary" onClick={() => setMeasure(false)}>km/h</button>
      <button type="button" className="btn btn-primary" onClick={() => setMeasure(true)}>mp/h</button>
    </div>
  </>);
}

export default Settings