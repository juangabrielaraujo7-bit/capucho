// Compare what was shown to the customer; this never authorizes a price or discount.
const itemSnapshot = items => JSON.stringify(items.filter(item => item.productId).map(item => [item.step, item.productId, item.name, item.cents]));
export function quoteNeedsReview(previous, next, displayedItems, subtotalCents) {
  if (previous?.version) return previous.version !== next.version;
  return next.totalCents !== (previous?.totalCents ?? subtotalCents)
    || itemSnapshot(next.items) !== itemSnapshot(previous?.items ?? displayedItems);
}
