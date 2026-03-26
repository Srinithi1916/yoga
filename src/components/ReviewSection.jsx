import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteReview, fetchReviewItem, fetchReviewSummaries, saveReview } from '../lib/reviewApi';
import GlassPanel from './GlassPanel';
import ReviewStars from './ReviewStars';

function emptyForm() {
  return {
    rating: 5,
    comment: '',
  };
}

function createSummaryMap(items, summaries) {
  const fallback = Object.fromEntries(
    items.map((item) => [
      item.reviewItemId,
      {
        itemId: item.reviewItemId,
        averageRating: 0,
        totalReviews: 0,
        fiveStarCount: 0,
        fourStarCount: 0,
        threeStarCount: 0,
        twoStarCount: 0,
        oneStarCount: 0,
      },
    ]),
  );

  summaries.forEach((summary) => {
    fallback[summary.itemId] = summary;
  });

  return fallback;
}

function breakdownRows(summary) {
  return [
    { label: '5', count: summary.fiveStarCount },
    { label: '4', count: summary.fourStarCount },
    { label: '3', count: summary.threeStarCount },
    { label: '2', count: summary.twoStarCount },
    { label: '1', count: summary.oneStarCount },
  ];
}

function sortReviews(reviews) {
  return [...reviews].sort((left, right) => {
    if (left.verifiedParticipant !== right.verifiedParticipant) {
      return Number(right.verifiedParticipant) - Number(left.verifiedParticipant);
    }

    if (left.rating !== right.rating) {
      return right.rating - left.rating;
    }

    return (left.userName || '').localeCompare(right.userName || '', undefined, { sensitivity: 'base' });
  });
}

function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`Set rating to ${star} ${star === 1 ? 'star' : 'stars'}`}
            className="rounded-full p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={`h-7 w-7 ${star <= value ? 'text-amber-400' : 'text-rose-200'}`}
              fill="currentColor"
            >
              <path d="M10 1.75l2.55 5.17 5.7.83-4.12 4.01.97 5.68L10 14.76 4.9 17.44l.97-5.68L1.75 7.75l5.7-.83L10 1.75z" />
            </svg>
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold text-rose-900/78">{value} out of 5</span>
    </div>
  );
}

function ReviewCard({ review, itemTitle = '', hideTitle = false }) {
  return (
    <div className="rounded-[1.85rem] border border-white/55 bg-white/60 p-5 shadow-glass">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-rose-950">{review.userName}</p>

            {review.mine ? (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-rose-700">
                Yours
              </span>
            ) : null}
          </div>
          <ReviewStars rating={review.rating} className="mt-2" />
        </div>
      </div>

      {itemTitle ? (
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-rose-600/75">{itemTitle}</p>
      ) : null}
      {!hideTitle && review.title ? <h5 className="mt-2 text-lg font-bold text-rose-900">{review.title}</h5> : null}
      <p className={`${itemTitle || (!hideTitle && review.title) ? 'mt-2' : 'mt-4'} text-sm leading-7 text-rose-900/80`}>
        {review.comment}
      </p>
    </div>
  );
}

function ReviewFeedSection({ items, title, description, anchorId, token }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    let ignore = false;

    async function loadFeed() {
      setIsLoading(true);
      setStatus({ type: 'idle', message: '' });

      try {
        const summaries = await fetchReviewSummaries(items.map((item) => item.reviewItemId));
        const summaryMap = createSummaryMap(items, summaries);
        const itemsWithReviews = items.filter((item) => (summaryMap[item.reviewItemId]?.totalReviews || 0) > 0);

        if (!itemsWithReviews.length) {
          if (!ignore) {
            setReviews([]);
          }
          return;
        }

        const results = await Promise.all(
          itemsWithReviews.map(async (item) => {
            const response = await fetchReviewItem(item.reviewItemId, token);
            return {
              item,
              reviews: response?.reviews || [],
            };
          }),
        );

        const merged = sortReviews(
          results.flatMap(({ item, reviews: itemReviews }) =>
            itemReviews.map((review) => ({
              ...review,
              itemTitle: item.title,
            })),
          ),
        );

        if (!ignore) {
          setReviews(merged);
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message || 'Could not load reviews.' });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadFeed();
    return () => {
      ignore = true;
    };
  }, [items, token]);

  const hasScrollableFeed = reviews.length > 5;

  return (
    <GlassPanel id={anchorId} className="rounded-[2.5rem] p-5 shadow-bloom sm:p-6">
      <div className="space-y-5">
        {title || description ? (
          <div>
            {title ? <h3 className="font-display text-4xl text-rose-950 sm:text-5xl">{title}</h3> : null}
            {description ? <p className="mt-3 max-w-3xl text-base leading-8 text-rose-900/80">{description}</p> : null}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-[1.85rem] bg-white/60 px-5 py-6 text-sm leading-7 text-rose-900/82 shadow-glass">
            Loading reviews...
          </div>
        ) : reviews.length ? (
          <>
            {hasScrollableFeed ? (
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-600/70">
                Scroll down to see more reviews
              </p>
            ) : null}
            <div className={`space-y-4 ${hasScrollableFeed ? 'max-h-[36rem] overflow-y-auto pr-2 sm:pr-3' : ''}`}>
              {reviews.map((review) => (
                <ReviewCard
                  key={`${review.id}-${review.itemTitle}`}
                  review={review}
                  itemTitle={review.itemTitle}
                  hideTitle={review.title === review.itemTitle}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[1.85rem] bg-white/60 px-5 py-6 text-sm leading-7 text-rose-900/82 shadow-glass">
            No reviews yet.
          </div>
        )}

        {status.type === 'error' ? (
          <div className="rounded-xl bg-rose-50/75 px-4 py-3 text-sm leading-6 text-rose-900 shadow-glass">
            {status.message}
          </div>
        ) : null}
      </div>
    </GlassPanel>
  );
}

export default function ReviewSection({ items, title, description, anchorId, mode = 'full' }) {
  const { token, user, isAuthenticated } = useAuth();
  const isReadOnly = mode === 'feed' || !isAuthenticated;
  const [activeItemId, setActiveItemId] = useState(items[0]?.reviewItemId || '');
  const [summaryMap, setSummaryMap] = useState(() => createSummaryMap(items, []));
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const activeItem = useMemo(
    () => items.find((item) => item.reviewItemId === activeItemId) || items[0],
    [items, activeItemId],
  );

  const activeSummary =
    summaryMap[activeItem?.reviewItemId] || createSummaryMap(items, [])[activeItem?.reviewItemId];

  useEffect(() => {
    if (!items.some((item) => item.reviewItemId === activeItemId)) {
      setActiveItemId(items[0]?.reviewItemId || '');
    }
  }, [items, activeItemId]);

  useEffect(() => {
    if (isReadOnly) {
      return undefined;
    }

    let ignore = false;

    async function loadSummaries() {
      try {
        const summaries = await fetchReviewSummaries(items.map((item) => item.reviewItemId));
        if (!ignore) {
          setSummaryMap(createSummaryMap(items, summaries));
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message || 'Could not load reviews.' });
        }
      }
    }

    loadSummaries();
    return () => {
      ignore = true;
    };
  }, [items, isReadOnly]);

  useEffect(() => {
    if (isReadOnly) {
      return undefined;
    }

    let ignore = false;

    async function loadDetail() {
      if (!activeItem) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchReviewItem(activeItem.reviewItemId, token);
        if (!ignore) {
          setDetail(response);
          if (response?.myReview) {
            setForm({
              rating: response.myReview.rating,
              comment: response.myReview.comment,
            });
          } else {
            setForm(emptyForm());
          }
        }
      } catch (error) {
        if (!ignore) {
          setStatus({ type: 'error', message: error.message || 'Could not load this section.' });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      ignore = true;
    };
  }, [activeItem, token, isReadOnly]);

  async function refreshSummaries() {
    const summaries = await fetchReviewSummaries(items.map((item) => item.reviewItemId));
    setSummaryMap(createSummaryMap(items, summaries));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!activeItem) {
      return;
    }

    setIsSaving(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await saveReview(
        activeItem.reviewItemId,
        {
          itemName: activeItem.title,
          itemType: activeItem.reviewItemType,
          rating: Number(form.rating),
          title: activeItem.title,
          comment: form.comment.trim(),
        },
        token,
      );
      setDetail(response);
      await refreshSummaries();
      setStatus({ type: 'success', message: 'Your review was saved.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not save your review.' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!activeItem) {
      return;
    }

    setIsSaving(true);
    setStatus({ type: 'idle', message: '' });

    try {
      await deleteReview(activeItem.reviewItemId, token);
      const refreshed = await fetchReviewItem(activeItem.reviewItemId, token);
      setDetail(refreshed);
      setForm(emptyForm());
      await refreshSummaries();
      setStatus({ type: 'success', message: 'Your review was removed.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not remove the review.' });
    } finally {
      setIsSaving(false);
    }
  }

  if (isReadOnly) {
    return (
      <ReviewFeedSection
        items={items}
        title={title}
        description={description}
        anchorId={anchorId}
        token={token}
      />
    );
  }

  return (
    <GlassPanel id={anchorId} className="rounded-[2.5rem] p-5 shadow-bloom sm:p-6">
      <div className="space-y-6">
        {title || description ? (
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-600/75">Reviews</p>
            {title ? <h3 className="mt-2 font-display text-4xl text-rose-950 sm:text-5xl">{title}</h3> : null}
            {description ? <p className="mt-3 max-w-3xl text-base leading-8 text-rose-900/80">{description}</p> : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {items.map((item) => {
            const summary = summaryMap[item.reviewItemId] || activeSummary;
            const isSelected = item.reviewItemId === activeItemId;

            return (
              <button
                key={item.reviewItemId}
                type="button"
                onClick={() => setActiveItemId(item.reviewItemId)}
                className={`cursor-pointer rounded-[1.45rem] border px-4 py-3 text-left shadow-glass transition duration-200 ${
                  isSelected
                    ? 'border-fuchsia-300 bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white ring-2 ring-rose-200/70 shadow-[0_20px_45px_-24px_rgba(190,24,93,0.75)]'
                    : 'border-white/55 bg-white/50 text-rose-900/82 hover:-translate-y-1 hover:border-rose-200 hover:bg-white/78 hover:shadow-[0_20px_40px_-28px_rgba(190,24,93,0.45)]'
                }`}
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <div className={`mt-2 flex items-center gap-2 text-xs font-semibold ${isSelected ? 'text-white/90' : 'text-rose-700/80'}`}>
                  <ReviewStars rating={summary.averageRating} size="text-sm" />
                  <span>{summary.totalReviews} reviews</span>
                </div>
              </button>
            );
          })}
        </div>

        {activeItem ? (
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="rounded-[1.85rem] border border-white/55 bg-white/55 p-5 shadow-glass">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600/75">Selected</p>
                    <h4 className="mt-2 font-display text-3xl text-rose-950">{activeItem.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-rose-900/80">{activeItem.reviewItemTypeLabel}</p>
                  </div>
                  <div className="rounded-[1.35rem] bg-white/75 px-4 py-3 text-center shadow-glass">
                    <p className="text-3xl font-bold text-rose-900">{activeSummary.averageRating.toFixed(1)}</p>
                    <ReviewStars rating={activeSummary.averageRating} className="mt-2 justify-center" />
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-600/75">
                      {activeSummary.totalReviews} review{activeSummary.totalReviews === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {breakdownRows(activeSummary).map((row) => {
                    const width = activeSummary.totalReviews
                      ? `${Math.max((row.count / activeSummary.totalReviews) * 100, row.count > 0 ? 8 : 0)}%`
                      : '0%';

                    return (
                      <div key={row.label} className="flex items-center gap-3 text-sm text-rose-900/80">
                        <span className="w-6 font-semibold">{row.label}</span>
                        <span className="w-8 text-center font-semibold text-rose-700/80">star</span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-rose-100/80">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-rose-400"
                            style={{ width }}
                          />
                        </div>
                        <span className="w-8 text-right font-semibold">{row.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="rounded-[1.85rem] bg-white/55 px-5 py-6 text-sm leading-7 text-rose-900/82 shadow-glass">
                    Loading {activeItem.title}...
                  </div>
                ) : detail?.reviews?.length ? (
                  detail.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} hideTitle={review.title === activeItem.title} />
                  ))
                ) : (
                  <div className="rounded-[1.85rem] bg-white/55 px-5 py-6 text-sm leading-7 text-rose-900/82 shadow-glass">
                    No reviews yet for {activeItem.title}.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[1.85rem] border border-white/55 bg-white/55 p-4 shadow-glass">
              <h4 className="font-display text-3xl text-rose-950">Write Review</h4>
              <p className="mt-2 text-sm leading-6 text-rose-900/80">Add or update your review.</p>

              <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
                <p className="text-sm text-rose-900/78">
                  Signed in as <span className="font-semibold">{user.name}</span>
                </p>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-rose-900">Type</label>
                  <select
                    value={activeItemId}
                    onChange={(event) => setActiveItemId(event.target.value)}
                    className="w-full rounded-xl border border-white/60 bg-white/75 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white"
                  >
                    {items.map((item) => (
                      <option key={item.reviewItemId} value={item.reviewItemId}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-rose-900">Rating</label>
                  <StarRatingInput
                    value={form.rating}
                    onChange={(value) => setForm((current) => ({ ...current, rating: value }))}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-rose-900">Review</label>
                  <textarea
                    value={form.comment}
                    onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
                    rows="4"
                    required
                    className="w-full rounded-xl border border-white/60 bg-white/75 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white"
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : detail?.myReview ? 'Update' : 'Submit'}
                  </button>
                  {detail?.myReview ? (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleDelete}
                      className="btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </form>

              {status.type !== 'idle' ? (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-sm leading-6 shadow-glass ${
                    status.type === 'success'
                      ? 'bg-emerald-50/75 text-emerald-900'
                      : 'bg-rose-50/75 text-rose-900'
                  }`}
                >
                  {status.message}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </GlassPanel>
  );
}


