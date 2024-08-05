"""
Quadtree is a tree data structure in which each internal node either is a leaf node or has exactly 4 children. Quadtrees are most often used to partition a two-dimensional space by recursively subdividing it into four quadrants or regions. One of the common use cases of quadtree is image compression, for example:
Input Image:
+---------+--------+
|  2 |  2 |  3 | 3 |
+----|----|----|---|
|  2 |  2 |  3 | 3 |
+----+----|--------|
|  4 |  2 |  5 | 5 |
+----|----|----|---|
|  2 |  3 |  5 | 5 |
+----+----+--------+

Quadtree representation:
+---------+--------+
|         |        |
|    2    |    3   |
|         |        |
+----+----|--------|
| 4  | 2  |        |
+----|----|    5   |
| 2  | 3  |        |
+----+----+--------+

Design the quadtree data structure and write a function that builds a quadtree for an input image, where image will be given as a two-d array of integers.

"""


class QuadTreeNode:
    def __init__(self, value=None, is_leaf=True):
        self.value = value
        self.is_leaf = is_leaf
        self.top_left = None
        self.top_right = None
        self.bottom_left = None
        self.bottom_right = None


def is_uniform(matrix, row_start, row_end, col_start, col_end):
    """Checks if all elements in the sub-matrix are the same"""
    first_value = matrix[row_start][col_start]
    for i in range(row_start, row_end):
        for j in range(col_start, col_end):
            if matrix[i][j] != first_value:
                return False
    return True


def build_quadtree(matrix, row_start, row_end, col_start, col_end):
    """Recursively building the quadtree from the given matrix"""
    if is_uniform(matrix, row_start, row_end, col_start, col_end):
        return QuadTreeNode(value=matrix[row_start][col_start], is_leaf=True)

    mid_row = (row_start + row_end) // 2
    mid_col = (col_start + col_end) // 2

    node = QuadTreeNode(is_leaf=False)
    node.top_left = build_quadtree(matrix, row_start, mid_row, col_start, mid_col)
    node.top_right = build_quadtree(matrix, row_start, mid_row, mid_col, col_end)
    node.bottom_left = build_quadtree(matrix, mid_row, row_end, col_start, mid_col)
    node.bottom_right = build_quadtree(matrix, mid_row, row_end, mid_col, col_end)

    return node


def print_quadtree(node, indent=0):
    """Helper function, just prints the quadtree"""
    prefix = ' ' * indent
    if node.is_leaf:
        print(f"{prefix}Leaf(value={node.value})")
    else:
        print(f"{prefix}Internal")
        print_quadtree(node.top_left, indent + 2)
        print_quadtree(node.top_right, indent + 2)
        print_quadtree(node.bottom_left, indent + 2)
        print_quadtree(node.bottom_right, indent + 2)


image = [
    [4, 4, 3, 3],
    [2, 2, 3, 3],
    [4, 2, 6, 5],
    [2, 3, 5, 5]
]

quadtree = build_quadtree(image, 0, len(image), 0, len(image[0]))
print_quadtree(quadtree)
