import jsonData from './htmlReport.json';
import './App.css';

function App() {
  console.log(jsonData);
  const { files, stats } = jsonData;
  return (
    <div className="App">
      {files.map((file) => {
        const { fileName, tests } = file;
        return (
          <div>
            {'\u001b'}
            <h1>{fileName}</h1>
            {Object.keys(stats).map((key) => {
              return <span>{`${key}: ${stats[key]} / `}</span>;
            })}
            <hr />
            {tests.map((test) => {
              const { title, error, path, projectName, location, duration, annotations, results } = test;
              const theme = annotations.find((annotation) => annotation.type === 'theme').description;
              return (
                <div>
                  <span>{`${path} - ${theme} > ${title} (${projectName})`}</span>
                  <p>{`${location.file}:${location.line}`}</p>
                  <p>{`Duration: ${duration}ms`}</p>
                  {results.map((result) => {
                    const { attachments } = result;
                    return (
                      <div>
                        {attachments.map((attachment) => {
                          const { name, path } = attachment;
                          return (
                            <div>
                              <p>{name}</p>
                              <img src={`/playwright-report/${path}`} alt={name} />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  <hr />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
