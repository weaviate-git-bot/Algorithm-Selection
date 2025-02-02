import {get} from "./dom.js";
import {binarySearch} from "./algorithms.js";

export function plotMetrics(libraryName, algorithmName, metricData, time) {
    Object.keys(metricData).forEach((metricName) => {
        let metricPlot = App.data[`${libraryName}-${algorithmName}-plots`][`${metricName}`];

        addPlotTimeData(metricPlot, metricData[metricName], time);
    });
}

export function addPlotTimeData(plot, data, time) {
    let lastLabelIndex = plot.data.labels.length
    plot.data.labels.push(time.toFixed(2));

    plot.data.datasets.forEach((dataset) => {
        if (!dataset.isAnnotation) {
            dataset.data.push(data);
        }
    });

    plot.update();
}

export function createPlotsVerticalLine(libraryName, algorithmName, name, xPosition) {
    for (const metricName in App.data[`${libraryName}-${algorithmName}-plots`]) {
        let plot = App.data[`${libraryName}-${algorithmName}-plots`][metricName];

        let interval = binarySearch(plot.data.labels, xPosition);
        let position = interval[0] === -1 ? 0 : interval[0];

        if (plot.data.labels[interval[1]]) {
            if (xPosition === plot.data.labels[interval[0]]) {
                position = interval[0];
            } else if (xPosition === plot.data.labels[interval[1]]) {
                position = interval[1];
            } else {
                position = xPosition - plot.data.labels[interval[0]] <= plot.data.labels[interval[1]] - xPosition ?
                    interval[0] : interval[1];
            }
        }

        createVerticalLine(App.data[`${libraryName}-${algorithmName}-plots`][metricName], name, position);
    }
}

export function createVerticalLine(plot, name, xPosition) {
    plot.options.plugins.annotation.annotations[name] = {
        type: 'line',
        borderColor: '#fb7185',
        borderWidth: 5,
        borderDash: [8, 8],
        drawTime: 'beforeDraw',
        scaleID: 'x',
        value: xPosition
    };

    plot.data.datasets.push(
        {
            type: 'line',
            isAnnotation: true,
            label: name,
            backgroundColor: '#fb7185',
            data: []
        }
    );

    plot.update();
}

export function createAlgorithmPlots(libraryName, algorithmName) {
    let memoryCanvas = get(`${libraryName}-${algorithmName}-plot-memory`);
    let cpuCanvas = get(`${libraryName}-${algorithmName}-plot-cpu`);

    App.data[`${libraryName}-${algorithmName}-plots`] = {
        "memory": new Chart(memoryCanvas,
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Memory (MB)',
                            data: [],
                            fill: false,
                            borderColor: 'rgb(51, 102, 255)',
                            tension: 0.1,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointHoverRadius: 10
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Memory (MB)',
                                font: {
                                    size: 20
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time (s)',
                                font: {
                                    size: 20
                                }
                            }
                        }
                    },
                    plugins: {
                        annotation: {
                            common: {
                                drawTime: 'beforeDraw'
                            },
                            annotations: {}
                        }
                    }
                }
            }
        ),
        "cpu": new Chart(cpuCanvas,
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'CPU (%)',
                            data: [],
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                            pointStyle: 'circle',
                            pointRadius: 5,
                            pointHoverRadius: 10
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'CPU %',
                                font: {
                                    size: 20
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Time (s)',
                                font: {
                                    size: 20
                                }
                            }
                        }
                    },
                    plugins: {
                        annotation: {
                            common: {
                                drawTime: 'beforeDraw'
                            },
                            annotations: {}
                        }
                    }
                }
            }
        )
    };
}