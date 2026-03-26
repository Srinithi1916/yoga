import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteReview, fetchReviewItem, fetchReviewSummaries, saveReview } from '../lib/reviewApi';
import GlassPanel from './GlassPanel';
import ReviewStars from './ReviewStars';

function emptyForm() {
  return {
    rating: 5,
    title: '',
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

export default function ReviewSection({ items, title, description, anchorId }) {
  const { token, user, isAuthenticated } = useAuth();
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
  const authRedirect = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';

  useEffect(() => {
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
  }, [items]);

  useEffect(() => {
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
              title: response.myReview.title,
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
  }, [activeItem, token]);

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
          title: form.title.trim(),
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

  return (
    <GlassPanel id={anchorId} className="rounded-[2.5rem] p-6 shadow-bloom sm:p-8">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-600/75">Reviews</p>
          <h3 className="mt-2 font-display text-5xl text-rose-950">{title}</h3>
          <p className="mt-3 max-w-3xl text-base leading-8 text-rose-900/80">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {items.map((item) => {
            const summary = summaryMap[item.reviewItemId] || activeSummary;
            return (
              <button
                key={item.reviewItemId}
                type="button"
                onClick={() => setActiveItemId(item.reviewItemId)}
                className={`rounded-[1.75rem] border px-4 py-3 text-left shadow-glass transition ${
                  item.reviewItemId === activeItemId
                    ? 'border-rose-300 bg-white/80 text-rose-950'
                    : 'border-white/55 bg-white/50 text-rose-900/82 hover:bg-white/70'
                }`}
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-rose-700/80">
                  <ReviewStars rating={summary.averageRating} size="text-sm" />
                  <span>{summary.totalReviews} reviews</span>
                </div>
              </button>
            );
          })}
        </div>

        {activeItem ? (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-[2rem] border border-white/55 bg-white/55 p-5 shadow-glass">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600/75">Selected</p>
                    <h4 className="mt-2 font-display text-4xl text-rose-950">{activeItem.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-rose-900/80">{activeItem.reviewItemTypeLabel}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white/75 px-5 py-4 text-center shadow-glass">
                    <p className="text-4xl font-bold text-rose-900">{activeSummary.averageRating.toFixed(1)}</p>
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
                  <div className="rounded-[2rem] bg-white/55 px-5 py-6 text-sm leading-7 text-rose-900/82 shadow-glass">
                    Loading {activeItem.title}...
                  </div>
                ) : detail?.reviews?.length ? (
                  detail.reviews.map((review) => (
                    <div key={review.id} className="rounded-[2rem] border border-white/55 bg-white/55 p-5 shadow-glass">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-rose-950">{review.userName}</p>
                            {review.verifiedParticipant ? (
                              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                                Verified Member
                              </span>
                            ) : null}
                            {review.mine ? (
                              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-rose-700">
                                Your Review
                              </span>
                            ) : null}
                          </div>
                          <ReviewStars rating={review.rating} className="mt-2" />
                        </div>
                      </div>
                      <h5 className="mt-4 text-lg font-bold text-rose-900">{review.title}</h5>
                      <p className="mt-2 text-sm leading-7 text-rose-900/80">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2rem] bg-white/55 px-5 py-6 text-sm leading-7 text-rose-900/82 shadow-glass">
                    No reviews yet for {activeItem.title}.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/55 bg-white/55 p-5 shadow-glass">
              <h4 className="font-display text-4xl text-rose-950">Write Review</h4>
              <p className="mt-3 text-sm leading-7 text-rose-900/80">Post or edit your review here.</p>

              {isAuthenticated ? (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="rounded-2xl bg-white/65 px-4 py-4 text-sm leading-7 text-rose-900/82">
                    Signed in as <span className="font-semibold">{user.name}</span> ({user.email})
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-rose-900">Rating</label>
                    <select
                      value={form.rating}
                      onChange={(event) => setForm((current) => ({ ...current, rating: Number(event.target.value) }))}
                      className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} Star{value === 1 ? '' : 's'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-rose-900">Title</label>
                    <input
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      required
                      className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-rose-900">Review</label>
                    <textarea
                      value={form.comment}
                      onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
                      rows="5"
                      required
                      className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
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
              ) : (
                <div className="mt-6 space-y-4 rounded-[1.75rem] bg-white/65 px-5 py-5 text-sm leading-7 text-rose-900/82">
                  <p>Sign in to post a review.</p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/auth?mode=signup&redirect=${encodeURIComponent(authRedirect)}`} className="btn-primary">
                      Sign Up
                    </Link>
                    <Link to={`/auth?mode=login&redirect=${encodeURIComponent(authRedirect)}`} className="btn-secondary">
                      Log In
                    </Link>
                  </div>
                </div>
              )}

              {status.type !== 'idle' ? (
                <div
                  className={`mt-5 rounded-2xl px-4 py-4 text-sm leading-7 shadow-glass ${
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

