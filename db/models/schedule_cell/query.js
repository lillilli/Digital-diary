const ScheduleCells = require('./table');

class ScheduleCellsQuery {
    static get(params = {}) {
        return new Promise((res, rej) => {
            ScheduleCells.find(params, {
                _v: false
            }, (err, data) => {
                return err ? rej(err) : res(data);
            })
        });
    }

    static getId(course, squad) {
        return new Promise((res, rej) => {
            ScheduleCells.find({
                course,
                squad
            }, (err, data) => {
                return data[0] ? res(data[0]._id) : res(undefined);
            })
        });
    }

    static add(data) {
        return new Promise((res, rej) => {
            const newItem = new ScheduleCells(data);

            newItem.save(function (err) {
                return (!err) ? res(newItem._id) : rej(err);
            });
        });
    }

    static update(params, conditions = {}) {
        return new Promise((res, rej) => {
            ScheduleCells.update(conditions, params, function (err) {
                return (!err) ? res(true) : rej(err);
            });
        });
    }

    static deleteByDisciplineIds(disciplineIds) {
        return new Promise((res, rej) => {
            ScheduleCells.remove({
                discipline_id: {
                    $in: disciplineIds
                }
            }, (err, success) => {
                return (!err) ? res(success) : rej(err);
            })
        })
    }

    static deleteByIds(ids) {
        return new Promise((res, rej) => {
            ScheduleCells.remove({
                _id: {
                    $in: ids
                }
            }, (err, success) => {
                return (!err) ? res(success) : rej(err);
            })
        })
    }
}

module.exports = ScheduleCellsQuery;