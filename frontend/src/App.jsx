import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const MainPage = () => {
  const [data, setData] = useState(null); // Veriyi tek belge olarak tutar
  const [open, setOpen] = useState(false); // Detaylar görünürlüğü

  useEffect(() => {
    // İlk veri yüklemesi
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getalldata");
        if (response.data.length > 0) {
          setData(response.data[0]); // İlk belgeyi set et
          console.log(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Socket.IO bağlantısı
    const socket = io("http://localhost:3000");

    socket.on("data", (newData) => {
      setData(newData); // Yeni veriyi al ve state'i güncelle
    });

    return () => {
      socket.disconnect(); // Bileşen unmount olduğunda bağlantıyı kapat
    };
  }, []);

  if (
    !data ||
    !data.x ||
    !data.y ||
    !data.z ||
    !data.temperature ||
    !data.smoke ||
    !data.times
  ) {
    return <p>Data not available.</p>;
  }

  return (
    <div>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Temperature</th>
            <th>Smoke</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody className="border-b-2 border-gray-400">
          <tr key={data.id}>
            <td>{data.id}</td>
            <td
              className={
                data.temperature[data.x.length - 1] > 29
                  ? "bg-red-800"
                  : "bg-green-500"
              }
            >
              {data.temperature[data.x.length - 1]}
            </td>
            <td
              className={
                data.gasStatus[data.x.length - 1] == 0
                  ? "bg-red-800"
                  : "bg-green-500"
              }
            >
              {data.smoke[data.x.length - 1]}
            </td>
            <td
              className={
                Math.abs(
                  data.x[data.x.length - 1] - data.x[data.x.length - 2]
                ) > 1
                  ? "bg-red-800"
                  : "bg-green-500"
              }
            >
              {data.x[data.x.length - 1]}
            </td>
            <td
              className={
                Math.abs(
                  data.y[data.x.length - 1] - data.y[data.x.length - 2]
                ) > 1
                  ? "bg-red-800"
                  : "bg-green-500"
              }
            >
              {data.y[data.x.length - 1]}
            </td>
            <td
              className={
                Math.abs(
                  data.z[data.x.length - 1] - data.z[data.x.length - 2]
                ) > 1
                  ? "bg-red-800"
                  : "bg-green-500"
              }
            >
              {data.z[data.x.length - 1]}
            </td>
            <td className="time">
              {new Date(data.times[data.x.length - 1]).toLocaleString()}
            </td>
            <td>
              <button onClick={() => setOpen(!open)}>
                {open ? "Gizle" : "Detaylar"}
              </button>
            </td>
          </tr>
        </tbody>
        {/* Detayları aç ve kapat */}
        <tbody style={{ display: open ? "table-row-group" : "none" }}>
          {data.x.map((_, index) => (
            <tr key={data.id + "-" + index}>
              <td>{data.id}</td>
              <td
                className={
                  data.temperature[data.x.length - 1 - index] > 29
                    ? "bg-red-800"
                    : "bg-green-500"
                }
              >
                {data.temperature[data.x.length - 1 - index]}
              </td>
              <td
                className={
                  data.gasStatus[data.x.length - 1 - index] == 0
                    ? "bg-red-800"
                    : "bg-green-500"
                }
              >
                {data.smoke[data.x.length - 1 - index]}
              </td>
              <td
                className={
                  Math.abs(
                    data.x[data.x.length - 1 - index] -
                      data.x[data.x.length - 2 - index]
                  ) > 1
                    ? "bg-red-800"
                    : "bg-green-500"
                }
              >
                {data.x[data.x.length - 1 - index]}
              </td>
              <td
                className={
                  Math.abs(
                    data.y[data.x.length - 1 - index] -
                      data.y[data.x.length - 2 - index]
                  ) > 1
                    ? "bg-red-800"
                    : "bg-green-500"
                }
              >
                {data.y[data.x.length - 1 - index]}
              </td>
              <td
                className={
                  Math.abs(
                    data.z[data.x.length - 1 - index] -
                      data.z[data.x.length - 2 - index]
                  ) > 1
                    ? "bg-red-800"
                    : "bg-green-500"
                }
              >
                {data.z[data.x.length - 1 - index]}
              </td>
              <td className="time">
                {new Date(
                  data.times[data.x.length - 1 - index]
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainPage;
