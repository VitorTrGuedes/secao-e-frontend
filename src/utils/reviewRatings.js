function getArticleText(article) {
  return [article?.content, article?.content_html]
    .filter(Boolean)
    .join(' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ');
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].replace(',', '.');
  }
  return null;
}

export function getReviewRatings(article) {
  const text = getArticleText(article);
  const rottenTomatoes = article?.rotten_tomatoes_rating
    ?? article?.rotten_tomatoes_score
    ?? article?.rotten_tomatoes
    ?? article?.rt_score
    ?? firstMatch(text, [
      /(\d{1,3})\s*%\s*(?:no|em)?\s*rotten\s*tomatoes/i,
      /rotten\s*tomatoes\s*(?:[—:-]\s*)?(\d{1,3})\s*%/i
    ]);
  const imdb = article?.imdb_rating
    ?? article?.imdb_score
    ?? article?.imdb
    ?? firstMatch(text, [
      /(\d+(?:[.,]\d+)?)\s*\/\s*10\s*(?:no|em)?\s*imdb/i,
      /imdb\s*(?:[—:-]\s*)?(\d+(?:[.,]\d+)?)(?:\s*\/\s*10)?/i
    ]);

  return {
    rottenTomatoes: rottenTomatoes || '—',
    imdb: imdb || '—'
  };
}

export function formatRottenTomatoesRating(rating) {
  return rating === '—' || String(rating).endsWith('%') ? rating : `${rating}%`;
}

export function formatImdbRating(rating) {
  return rating === '—' || String(rating).endsWith('/10') ? rating : `${rating}/10`;
}
