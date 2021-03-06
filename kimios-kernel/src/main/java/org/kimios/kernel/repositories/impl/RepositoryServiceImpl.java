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
package org.kimios.kernel.repositories.impl;

import org.kimios.kernel.repositories.model.Repository;
import org.kimios.kernel.repositories.dao.RepositoryFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author Fabien Alin (Farf) <a href="mailto:fabien.alin@gmail.com">fabien.alin@gmail.com</a>
 */
@Transactional
public class RepositoryServiceImpl implements RepositoryService
{
    private RepositoryFactory repositoryFactory;

    public RepositoryFactory getRepositoryFactory()
    {
        return repositoryFactory;
    }

    public void setRepositoryFactory(RepositoryFactory repositoryFactory)
    {
        this.repositoryFactory = repositoryFactory;
    }

    public Repository loadDefaultRepository() throws Exception
    {
        return repositoryFactory.findDefaultRepository();
    }

    public Repository loadRepository(Long id) throws Exception
    {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    public List<Repository> loadRepositories() throws Exception
    {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }
}
