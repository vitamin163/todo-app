import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Tasks from '../Tasks/Tasks';
import Auth from '../Auth/Auth';
import Registration from '../Registration/Registration';
import Logout from '../Logout/Logout';

const mapStateToProps = state => {
  const props = {
    isAuthenticated: !!state.auth.token,
  };
  return props;
};

class App extends React.PureComponent {
  render() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return (
        <>
          <Redirect to="/tasks" component={Tasks} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/logout" component={Logout} />
        </>
      );
    }
    return (
      <Switch>
        <Route exact path="/" component={Auth} />
        <Route path="/registration" component={Registration} />
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default withRouter(connect(mapStateToProps)(App));
