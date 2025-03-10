import React from 'react';

class MediaQuery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMediaQueryMet: false,
    };

    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    let width = this.props.width;

    if (!this.props.operator) {
      this.setState({ isMediaQueryMet: false });
      return;
    }

    if (!width && !this.props.screenSize) {
      this.setState({ isMediaQueryMet: false });
      return;
    }

    if (!width && this.props.screenSize) {
      width = this.getWidthByScreenType();
    }

    switch (this.props.operator) {
      case '>':
        this.setState({ isMediaQueryMet: window.innerWidth > width });
        break;
      case '>=':
        this.setState({ isMediaQueryMet: window.innerWidth >= width });
        break;
      case '<':
        this.setState({ isMediaQueryMet: window.innerWidth < width });
        break;
      case '<=':
        this.setState({ isMediaQueryMet: window.innerWidth <= width });
        break;
      case '=':
        this.setState({ isMediaQueryMet: window.innerWidth === width });
        break;
      default:
        this.setState({ isMediaQueryMet: false });
        break;
    }
  }

  getWidthByScreenType() {
    switch (this.props.screenSize) {
      case 'desktop':
        return '1800';
      case 'tab-land':
        return '1200';
      case 'tab-port':
        return '900';
      case 'phone':
        return '600';
      default:
        return '1200';
    }
  }

  render() {
    const isMediaQueryMet = this.state.isMediaQueryMet;

    return <>{isMediaQueryMet ? this.props.children : <></>}</>;
  }
}

export default MediaQuery;
