import {Component} from 'react';

const DefaultLoadingComponent = (props) => <div>加载中....</div>;

export default function dynamic(config) {
  const {app, models, component} = config;
  return class DynamicComponent extends Component {
    constructor(props) {
      super(props);
      // 加载组件
      this.LoadingComponent = config.LoadingComponent || DefaultLoadingComponent;
      this.state = {AsyncComponent: null}
    }
    async componentDidMount() {
      let [asyncModels, AsyncComponent] = await Promise.all([Promise.all(models()), component()]);
      // console.log(asyncModels, AsyncComponent);
      asyncModels = asyncModels.map(model => model.default || model);
      AsyncComponent = AsyncComponent.default || AsyncComponent;
      asyncModels.forEach(model => app.model(model));
      this.setState({AsyncComponent})
    }
    render() {
      const {AsyncComponent} = this.state;
      const {LoadingComponent} = this;
      return AsyncComponent ? <AsyncComponent {...this.props} /> : <LoadingComponent />
    }
  }
}
