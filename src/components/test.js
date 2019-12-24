//下個月
nextMonth = () => {
  console.log("1111111111112");
  let { data, initYearMonth } = this.state;
  this.data = [];
  console.log("this.data", this.data);
  data.map(item => {
    if (
      item["date"].substring(0, 7) ===
      moment(initYearMonth, "YYYYMM")
        .add(+1, "M")
        .format("YYYY/MM")
    ) {
      return this.data.push(item);
    }
    return false;
  });
};

goNext = e => {
  let { monthListArr, nowYM, initYearMonth } = this.state;
  let $btn = e.currentTarget;
  this.nextMonth();
  this.props.onClickNext($btn, this.data, this);

  if (nowYM >= monthListArr.length - 1) {
    nowYM = monthListArr.length - 1;
  } else {
    nowYM = nowYM + 1;
  }
  initYearMonth = monthListArr[nowYM];
  console.log("$btn", $btn);
  this.setState(
    {
      $btn,
      nowYM,
      initYearMonth
    },
    () => {
      this.slideYM();
    }
  );
};

//上個月
prevMonth = () => {
  console.log("222222222221");
  let { data, initYearMonth } = this.state;
  this.data = [];
  console.log("this.data", this.data);
  data.map(item => {
    if (
      item["date"].substring(0, 7) ===
      moment(initYearMonth, "YYYYMM")
        .add(-1, "M")
        .format("YYYY/MM")
    ) {
      return this.data.push(item);
    }
    return false;
  });
};

goPrev = e => {
  let { monthListArr, nowYM, initYearMonth } = this.state;
  let $btn = e.currentTarget;
  this.prevMonth();
  this.props.onClickPrev($btn, this.data, this);

  if (nowYM === 0) {
    nowYM = 0;
  } else {
    nowYM = nowYM - 1;
  }
  initYearMonth = monthListArr[nowYM];
  this.setState(
    {
      nowYM,
      $btn,
      initYearMonth
    },
    () => {
      this.slideYM();
    }
  );
};
<div className="pages">
  <span>1/3</span>
  <a>
    <span>上一頁</span>
    <span>下一頁</span>
  </a>
</div>;
