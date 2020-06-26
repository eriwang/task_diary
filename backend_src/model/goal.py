class Goal:
    def __init__(self, goal_id, name):
        self.id = goal_id
        self.name = name

    @classmethod
    def query_all_goals(cls, cursor):
        cursor.execute('SELECT * FROM goals')
        return [cls._create_from_fetch_result(result) for result in cursor.fetchall()]

    @classmethod
    def _create_from_fetch_result(cls, result):
        return cls(result[0], result[1])

    def to_json_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def __str__(self):
        return self.name


def create_goal_table(cursor):
    query_string = '''
    CREATE TABLE goals (
        id INTEGER PRIMARY KEY,
        name TEXT
    )
    '''
    cursor.execute(query_string)


def add_goal(cursor, name):
    cursor.execute('INSERT INTO goals (name) VALUES (?)', (name, ))


def modify_goal(cursor, goal_id, name):
    cursor.execute('UPDATE goals SET name = ? WHERE id = ?', (name, goal_id))


def delete_goal(cursor, goal_id):
    cursor.execute('DELETE FROM goals WHERE id = ?', (goal_id, ))
