import re
import Counter  # type: ignore


def find_shortest_subsegment(text, k, words):
    # Normalize text by removing and converting to lowercase
    clean_text = re.sub(r'[^a-zA-Z\s]', '', text).lower()
    text_words = clean_text.split()
    word_set = set(words)
    word_count = Counter()
    required_word_count = len(word_set)
    start = 0
    min_len = float('inf')
    min_start = 0
    num_words_found = 0

    for end, word in enumerate(text_words):
        if word in word_set:
            word_count[word] += 1
            if word_count[word] == 1:
                num_words_found += 1

        while num_words_found == required_word_count:
            if end - start + 1 < min_len:
                min_len = end - start + 1
                min_start = start

            if text_words[start] in word_set:
                word_count[text_words[start]] -= 1
                if word_count[text_words[start]] == 0:
                    num_words_found -= 1

            start += 1
    if min_len == float('inf'):
        return "NO SUBSEGMENT FOUND"

    # Extract and clean the original segment from the input text
    original_words = re.findall(r'\b\w+\b', text)
    segment = original_words[min_start:min_start + min_len]

    return ' '.join(segment)


paragraph = input().strip()
k = int(input().strip())
words = [input().strip().lower() for _ in range(k)]

# Output
result = find_shortest_subsegment(paragraph, k, words)
print(result)
