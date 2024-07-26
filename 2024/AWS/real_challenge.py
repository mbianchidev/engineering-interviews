
##


def reducegifts(prices, k, threshold):
    prices.sort(reverse=True)
    removed_count = 0
    while len(prices) >= k:
        if sum(prices[:k]) <= threshold:
            break
        prices.pop(0)
        removed_count += 1
    return removed_count

#


def getMaxConsecutiveON(server_states, k):
    n = len(server_states)
    left = 0
    max_consecutive_on = 0
    zeros_flipped = 0
    for right in range(n):
        if server_states[right] == '0':
            zeros_flipped += 1
        while zeros_flipped > k:
            if server_states[left] == '0':
                zeros_flipped -= 1
            left += 1
        max_consecutive_on = max(max_consecutive_on, right - left + 1)
    return max_consecutive_on
