// @flow

import React, { Component } from "react";
import GraphiQL from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";
import { buildClientSchema, getIntrospectionQuery, parse } from "graphql";

import { makeDefaultArg, getDefaultScalarArgValue } from "./CustomArgs";

import "graphiql/graphiql.css";
import "./App.css";

import type { GraphQLSchema } from "graphql";

const DEFAULT_QUERY = `# shift-option/alt-click on a query below 
# to jump to it in the explorer
# option/alt-click on a field in the explorer 
# to select all subfields
`;

type State = {
  schema: ?GraphQLSchema,
  query: string,
  explorerIsOpen: boolean,
  url:string,
  token:string
};

type Props = {
  url: string
};

var savedUrl = localStorage.getItem("url") || "http://localhost:8888/graphql"
var savedToken = localStorage.getItem("token") || ""

class App extends Component<Props, State> {
  _graphiql: GraphiQL;
  state = {   
    schema: null, 
    query: DEFAULT_QUERY, 
    explorerIsOpen: true, 
    url:savedUrl,
    token:savedToken
  };

  fetcher(params: Object): Object {
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    if (savedToken) {
      headers["Authorization"] = "Bearer " + savedToken
    }
    return fetch(
      savedUrl,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params)
      }
    )
      .then(function(response) {
        return response.text();
      })
      .then(function(responseBody) {
        try {
          return JSON.parse(responseBody);
        } catch (e) {
          return responseBody;
        }
      });
  }

  componentDidMount() {
    this.init()
  }

  init() {
    this.fetcher({ query: getIntrospectionQuery()}).then(result => {
      const editor = this._graphiql.getQueryEditor();
      editor.setOption("extraKeys", {
        ...(editor.options.extraKeys || {}),
        "Shift-Alt-LeftClick": this._handleInspectOperation
      });

      this.setState({ schema: buildClientSchema(result.data) });
    });
  }

  _handleInspectOperation = (
    cm: any,
    mousePos: { line: Number, ch: Number }
  ) => {
    const parsedQuery = parse(this.state.query || "");

    if (!parsedQuery) {
      console.error("Couldn't parse query document");
      return null;
    }

    var token = cm.getTokenAt(mousePos);
    var start = { line: mousePos.line, ch: token.start };
    var end = { line: mousePos.line, ch: token.end };
    var relevantMousePos = {
      start: cm.indexFromPos(start),
      end: cm.indexFromPos(end)
    };

    var position = relevantMousePos;

    var def = parsedQuery.definitions.find(definition => {
      if (!definition.loc) {
        console.log("Missing location information for definition");
        return false;
      }

      const { start, end } = definition.loc;
      return start <= position.start && end >= position.end;
    });

    if (!def) {
      console.error(
        "Unable to find definition corresponding to mouse position"
      );
      return null;
    }

    var operationKind =
      def.kind === "OperationDefinition"
        ? def.operation
        : def.kind === "FragmentDefinition"
        ? "fragment"
        : "unknown";

    var operationName =
      def.kind === "OperationDefinition" && !!def.name
        ? def.name.value
        : def.kind === "FragmentDefinition" && !!def.name
        ? def.name.value
        : "unknown";

    var selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

    var el = document.querySelector(selector);
    el && el.scrollIntoView();
  };

  _handleEditQuery = (query: string): void => this.setState({ query });

  _handleToggleExplorer = () => {
    this.setState({ explorerIsOpen: !this.state.explorerIsOpen });
  };

  _handleSetUrl = () => {
    localStorage.setItem("url", this.state.url)
    window.location.reload()
  }

  _handleSetToken = () => {
    localStorage.setItem("token", this.state.token)
    window.location.reload()
  }

  render() {
    const { query, schema } = this.state;
    return (
      <div className="graphiql-container">
        <GraphiQLExplorer
          schema={schema}
          query={query}
          onEdit={this._handleEditQuery}
          onRunOperation={operationName =>
            this._graphiql.handleRunQuery(operationName)
          }
          explorerIsOpen={this.state.explorerIsOpen}
          onToggleExplorer={this._handleToggleExplorer}
          getDefaultScalarArgValue={getDefaultScalarArgValue}
          makeDefaultArg={makeDefaultArg}
        />
        <GraphiQL
          ref={ref => (this._graphiql = ref)}
          fetcher={this.fetcher}
          schema={schema}
          query={query}
          onEditQuery={this._handleEditQuery}
        >
          <GraphiQL.Toolbar>
            <GraphiQL.Button
              onClick={() => this._graphiql.handlePrettifyQuery()}
              label="Prettify"
              title="Prettify Query (Shift-Ctrl-P)"
            />
            <GraphiQL.Button
              onClick={() => this._graphiql.handleToggleHistory()}
              label="History"
              title="Show History"
            />
            <GraphiQL.Button
              onClick={this._handleToggleExplorer}
              label="Explorer"
              title="Toggle Explorer"
            />
            <span className="custom-input-wrap">
              GraphQL API:
              <input className="custom-input" type="text" onChange={(ev) => this.setState({url:ev.target.value})} value={this.state.url} />
              <GraphiQL.Button
                onClick={this._handleSetUrl}
                label="Set URL"
                title="Set URL"
              />
            </span>
            <span className="custom-input-wrap">
              Token:
              <input className="custom-input" type="text" onChange={(ev) => this.setState({token:ev.target.value})} value={this.state.token} />
              <GraphiQL.Button
                  onClick={this._handleSetToken}
                  label="Set Token"
                  title="Set Token"
              />
            </span>
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    );
  }
}

export default App;
