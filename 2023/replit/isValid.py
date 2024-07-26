import json

def isValid(stale, latest, otjson):
    # Saving operations as json obj
    operations = json.loads(otjson)
    # Current pos starts at 0
    pos = 0

    # Iterating on operations
    for op in operations:
        if op["op"] == "insert":
            chars = op["chars"]
            stale = stale[:pos] + chars + stale[pos:]
            pos += len(chars)
        elif op["op"] == "delete":
            count = op["count"]
            # Delete operation goes further than the end of the string?
            if pos + count > len(stale):
                return False
            # Actually deleting
            stale = stale[:pos] + stale[pos + count:]
        elif op["op"] == "skip":
            count = op["count"]
            # Skipping further?
            if pos + count > len(stale):
                return False
            # Skipping in boundaries
            pos += count
        else:
            print("Invalid operation")
            return False
    # Now check if equal
    return stale == latest

# Test cases
print(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]'
))  # True

print(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]'
))  # False, delete past end

print(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations.',
    '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]'
))  # False, skip past end

print(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'We use operational transformations to keep everyone in a multiplayer repl in sync.',
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
))  # True

print(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
    '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]'
))  # False

print(isValid(
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
    '[]'
))  # True
