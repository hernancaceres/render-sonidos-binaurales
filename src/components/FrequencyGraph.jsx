
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory';

const FrequencyGraph = ({ data }) => {
  return (
    <VictoryChart>
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc"}
        }}
        data={data}
      />
      <VictoryAxis
        // Etiqueta para el eje X
        label="Tiempo"
      />
      <VictoryAxis
        // Etiqueta para el eje Y
        dependentAxis
        label="Frecuencia"
      />
    </VictoryChart>
  );
};

export default FrequencyGraph;
