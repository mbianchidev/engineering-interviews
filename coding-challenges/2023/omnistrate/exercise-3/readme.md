# Distribute Node Counting

Part 0: n array tree, from root traverse to count all nodes in tree

Part 1:

We have a N-array nodes tree in a distributed mode, and each node will have a list of child nodes. We need to count the whole nodes in this tree by sending signal to their child nodes. Starting from root server. (Hint: using async api + call back.)

Part 2:

What if specific child node failed/crashed. How to guarantee root server can still count remaining nodes in the tree network. (Fail fast with timeout)

Part 3:

On top of above timeout solution. What if child node in grey failure, the child node response slower than timeout, how do we detect this. (build a thread to periodically listen to child callback, if not in counting but receive callback, alarming)

Test cases for different parts.
