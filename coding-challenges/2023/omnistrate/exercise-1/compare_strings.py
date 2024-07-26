# Compare two version strings. 1.2.3.4 1.2 2.4
# a -> 1.2.4
# b -> 1.2.4.335

# a -> 1.2.0.0
# b -> 1.2
# // don't bother.

# b > a -> -1#
# a > b -> 1
# a == b -> 0

def compare_version_str(first, second):
    first = tuple(map(int, first.split(".")))
    second = tuple(map(int, second.split(".")))
    if first == second:
        return 0
    if first < second:
        return 1
    if second > first:
        return -1


result = compare_version_str("1.2.4", "1.2.4.335")
print(result)


def compare_version_str_alt(first, second):
    # removes only first leading 0, we don't expect more
    first = tuple(map(int, first.rstrip('0').rstrip('.').split(".")))
    second = tuple(map(int, second.rstrip('0').rstrip('.').split(".")))

    if first == second:
        return 0

    if len(first) > len(second):
        return 1
    elif len(first) == len(second):
        if first > second:
            return 1
        elif first < second:
            return -1
    else:
        print("len(first) > len(second)")
        return -1


result = compare_version_str_alt("1.2.0.0", "1.2.4")
if result is None:
    # contains literals or unsanitized input
    print("not comparable")
else:
    print(result)
