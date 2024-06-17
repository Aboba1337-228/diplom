import React, { useRef, useEffect } from 'react';
import * as Plot from '@observablehq/plot';

function Chart({ array, x, y }) {
    const plotRef = useRef(null);

    useEffect(() => {
        // Форматирование массива
        const formattedData = array.map((el, index) => ({ x: index + 1, y: el.result }))

        // Создаем график
        const chart = Plot.plot({
            x: {
                label: x,
                ticks: formattedData.map(d => d.x)
            },
            y: {
                label: y,
                domain: [0, 100]  // Максимальное значение Y задается здесь
            },
            marks: [
                Plot.line(formattedData, { x: "x", y: "y", curve: "catmull-rom" }),  // Линия, проходящая через все точки
                Plot.dot(formattedData, { x: "x", y: "y" })  // Точки на каждом значении данных
            ]
        });

        // Добавляем созданный график в DOM
        plotRef.current.appendChild(chart);

        return () => {
            // Очищаем при размонтировании
            if (plotRef.current && chart) {
                plotRef.current.removeChild(chart);
            }
        };
    }, [array]);

    return <div ref={plotRef}></div>;
}

export default Chart;