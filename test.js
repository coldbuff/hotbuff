const rootElement = document.getElementById("root");
ReactDOM.render(<HelloWorld />, rootElement);

function HelloWorld(){
    return <h1>Hello World</h1>;
}