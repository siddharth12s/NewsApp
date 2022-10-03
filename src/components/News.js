import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
 capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  articles = [];
  constructor(props) {
    super(props);
    this.state = {
      articles: this.articles,
      loading: false,
      page: 1,
    };
    document.title = `${this.capitalize(this.props.category)} - NewsApp`
  }

  async UpdateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=8e60bac999fb4a1caa328c5326c4268d&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let pardata = await data.json();
    console.log(pardata);
    this.props.setProgress(50);
    this.setState({
      articles: pardata.articles,
      totalResults: pardata.totalResults,
      loading: false,
    });
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.UpdateNews();
  }

  handleNextClick = async () => {
    await this.setState({ page: this.state.page + 1 });
    this.UpdateNews();
  };
  handlePreviousClick = async () => {
    await this.setState({ page: this.state.page - 1 });
    this.UpdateNews();
  };
  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center">NewsApp - Top Headlines from {this.capitalize(this.props.category)} </h1>
        {this.state.loading && <Spinner />}
        <div className="row ">
          {!this.state.loading &&
            this.state.articles.map((elem) => {
              return (
                <div className="col-md-4" key={elem.url}>
                  <NewsItem
                    title={elem.title ? elem.title : ""}
                    description={
                      elem.description ? elem.description.slice(0, 0) : ""
                    }
                    imageUrl={elem.urlToImage}
                    newsUrl={elem.url}
                    author={elem.author}
                    date={elem.publishedAt}
                    source={elem.source.name}
                  />
                </div>
              );
            })}
        </div>
        <div className="container d-flex justify-content-evenly">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePreviousClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
