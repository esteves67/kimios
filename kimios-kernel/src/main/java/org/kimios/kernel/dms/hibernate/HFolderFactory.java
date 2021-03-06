/*
 * Kimios - Document Management System Software
 * Copyright (C) 2008-2015  DevLib'
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * aong with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.kimios.kernel.dms.hibernate;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.exception.ConstraintViolationException;
import org.kimios.exceptions.ConfigException;
import org.kimios.kernel.dms.model.DMEntityType;
import org.kimios.kernel.dms.model.Folder;
import org.kimios.kernel.dms.FolderFactory;
import org.kimios.kernel.dms.model.Workspace;
import org.kimios.exceptions.DataSourceException;
import org.kimios.kernel.hibernate.HFactory;

import java.util.List;

public class HFolderFactory extends HFactory implements FolderFactory
{
    public void deleteFolder(Folder f) throws ConfigException,
            DataSourceException
    {
        try {
            getSession().delete(f);
        } catch (HibernateException e) {
            boolean integrity = e instanceof ConstraintViolationException;
            throw new DataSourceException(e, e.getMessage());
        }
    }

    public Folder getFolder(long uid) throws ConfigException,
            DataSourceException
    {
        try {
            Folder f = (Folder) getSession().get(Folder.class, new Long(uid));
            return f;
        } catch (HibernateException e) {
            boolean integrity = e instanceof ConstraintViolationException;
            throw new DataSourceException(e, e.getMessage());
        }
    }

    public Folder getFolder(String name, Folder f) throws ConfigException,
            DataSourceException
    {
        try {
            Query q = getSession().createQuery(
                    "from Folder f where f.name=:name and f.parentUid=:parentUid and f.parentType=:parentType")
                    .setString("name", name)
                    .setLong("parentUid", f.getUid())
                    .setInteger("parentType", DMEntityType.FOLDER);
            List<Folder> list = q.list();
            if (list.size() >= 1) {
                return list.get(0);
            } else {
                return null;
            }
        } catch (HibernateException e) {
            throw new DataSourceException(e);
        }
    }

    public Folder getFolder(String name, Workspace w) throws ConfigException,
            DataSourceException
    {
        try {
            Query q = getSession().createQuery(
                    "from Folder f where f.name=:name and f.parentUid=:parentUid and f.parentType=:parentType")
                    .setString("name", name)
                    .setLong("parentUid", w.getUid())
                    .setInteger("parentType", DMEntityType.WORKSPACE);
            List<Folder> list = q.list();
            if (list.size() >= 1) {
                return list.get(0);
            } else {
                return null;
            }
        } catch (HibernateException e) {
            throw new DataSourceException(e);
        }
    }

    public List<Folder> getFolders(Folder f) throws ConfigException,
            DataSourceException
    {
        try {
            Query q = getSession().createQuery(
                    "from Folder f where parentUid=:parentUid " +
                            "and parentType =:parentType " +
                            "and (f.trashed = false or f.trashed is null) " +
                            "order by f.name");
            q.setLong("parentUid", f.getUid());
            q.setInteger("parentType", DMEntityType.FOLDER);
            List<Folder> fList = q.list();
            return fList;
        } catch (HibernateException e) {
            throw new DataSourceException(e);
        }
    }

    public List<Folder> getFolders(Workspace w) throws ConfigException,
            DataSourceException
    {
        try {
            Query q = getSession().createQuery(
                    "from Folder f where parentUid=:parentUid and (f.trashed = false or f.trashed is null) " +
                            "and parentType =:parentType order by f.name");
            q.setLong("parentUid", w.getUid());
            q.setInteger("parentType", DMEntityType.WORKSPACE);
            List<Folder> fList = q.list();
            return fList;
        } catch (HibernateException e) {
            throw new DataSourceException(e);
        }
    }

    public void saveFolder(Folder f) throws ConfigException,
            DataSourceException
    {
        try {
            getSession().save(f);
            flush();
        } catch (HibernateException e) {
            boolean integrity = e instanceof ConstraintViolationException;
            throw new DataSourceException(e, e.getMessage());
        }
    }

    public void updateFolder(Folder f) throws ConfigException,
            DataSourceException
    {
        try {
            getSession().update(f);
        } catch (HibernateException e) {
            boolean integrity = e instanceof ConstraintViolationException;
            throw new DataSourceException(e, e.getMessage());
        }
    }
}

