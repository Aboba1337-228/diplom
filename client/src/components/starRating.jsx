import React from 'react';

function StarRating({ rating }) {
  const totalStars = 5;
  let stars = [];

  // Создание звезд на основе рейтинга
  for (let i = 0; i < totalStars; i++) {
    if (i < Math.floor(rating)) {
      // Полная звезда
      stars.push(<div className="star gold" key={i}></div>);
    } else if (i < rating) {
      // Частичная звезда, рассчитать процент
      const width = ((rating - i) * 100) + '%';
      stars.push(
        <div className="star partial" key={i} style={{ background: `linear-gradient(to right, gold ${width}, gray ${width})` }}></div>
      );
    } else {
      // Пустая звезда
      stars.push(<div className="star" key={i}></div>);
    }
  }

  return (
    <div className="flex text-2xl">
      {stars}
    </div>
  );
}

export default StarRating;